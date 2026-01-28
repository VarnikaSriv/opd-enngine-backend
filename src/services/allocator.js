const Slot = require('../models/Slot');
const { Token } = require('../models/Token');

// Priority order: EMERGENCY > PAID > FOLLOWUP > ONLINE > WALKIN
// Higher number = higher priority
function assignPriority(source) {
  const map = {
    EMERGENCY: 5,
    PAID: 4,
    FOLLOWUP: 3,
    ONLINE: 2,
    WALKIN: 1,
  };
  return map[source] || 0;
}

async function loadSlotWithTokens(slotId) {
  return Slot.findById(slotId).populate('tokens').exec();
}

async function bookToken(slotId, tokenData) {
  const slot = await loadSlotWithTokens(slotId);
  if (!slot) {
    throw new Error('Slot not found');
  }

  const priority = assignPriority(tokenData.source);

  if (slot.tokens.length >= slot.capacity) {
    // For normal booking, do not exceed capacity
    throw new Error('Slot is full');
  }

  const token = new Token({
    patientName: tokenData.patientName,
    source: tokenData.source,
    priority,
    slotId,
    status: 'BOOKED',
  });

  await token.save();
  slot.tokens.push(token._id);
  await slot.save();

  return token;
}

async function cancelToken(tokenId) {
  const token = await Token.findById(tokenId);
  if (!token) {
    throw new Error('Token not found');
  }

  token.status = 'CANCELLED';
  await token.save();

  await Slot.updateOne(
    { _id: token.slotId },
    { $pull: { tokens: token._id } }
  );

  return token;
}

async function markNoShow(tokenId) {
  const token = await Token.findById(tokenId);
  if (!token) {
    throw new Error('Token not found');
  }

  token.status = 'NO_SHOW';
  await token.save();

  return token;
}

async function addEmergencyToken(slotId, tokenData) {
  const slot = await loadSlotWithTokens(slotId);
  if (!slot) {
    throw new Error('Slot not found');
  }

  const priority = assignPriority('EMERGENCY');

  const emergencyToken = new Token({
    patientName: tokenData.patientName,
    source: 'EMERGENCY',
    priority,
    slotId,
    status: 'BOOKED',
  });

  await emergencyToken.save();

  if (slot.tokens.length < slot.capacity) {
    slot.tokens.push(emergencyToken._id);
    await slot.save();
    return { emergencyToken, evictedToken: null };
  }

  // Slot is full, evict lowest priority token
  let lowest = null;
  for (const existing of slot.tokens) {
    const fullToken =
      typeof existing.priority === 'number'
        ? existing
        : await Token.findById(existing);

    if (!fullToken) continue;

    if (!lowest || fullToken.priority < lowest.priority) {
      lowest = fullToken;
    }
  }

  if (!lowest) {
    // Fallback: if no token found, just push emergency without eviction
    slot.tokens.push(emergencyToken._id);
    await slot.save();
    return { emergencyToken, evictedToken: null };
  }

  // Mark evicted as cancelled and log
  lowest.status = 'CANCELLED';
  await lowest.save();
  console.log(
    `Evicted token ${lowest._id} from slot ${slotId} due to emergency arrival`
  );

  // Replace lowest token with emergency token
  slot.tokens = slot.tokens.filter(
    (id) => String(id) !== String(lowest._id)
  );
  slot.tokens.push(emergencyToken._id);
  await slot.save();

  return { emergencyToken, evictedToken: lowest };
}

// Optional: reallocate tokens inside a slot based on priority
async function reallocateSlot(slotId) {
  const slot = await loadSlotWithTokens(slotId);
  if (!slot) {
    throw new Error('Slot not found');
  }

  const bookedTokens = await Token.find({
    _id: { $in: slot.tokens },
  }).sort({ priority: -1, createdAt: 1 });

  slot.tokens = bookedTokens.map((t) => t._id);
  await slot.save();

  return slot;
}

module.exports = {
  assignPriority,
  bookToken,
  cancelToken,
  markNoShow,
  addEmergencyToken,
  reallocateSlot,
};

