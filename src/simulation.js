const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
const Slot = require('./models/Slot');
const { Token } = require('./models/Token');
const {
  bookToken,
  cancelToken,
  markNoShow,
  addEmergencyToken,
  reallocateSlot,
} = require('./services/allocator');

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/opd_engine';

async function printSlots(label, slots) {
  console.log(`\n=== ${label} ===`);
  for (const slot of slots) {
    const populated = await Slot.findById(slot._id).populate('tokens');
    console.log(
      `Slot ${populated._id} (doctor ${populated.doctorId}) [${populated.startTime}-${populated.endTime}] capacity=${populated.capacity}`
    );
    populated.tokens.forEach((t, idx) => {
      console.log(
        `  #${idx + 1} ${t.patientName} source=${t.source} priority=${t.priority} status=${t.status}`
      );
    });
  }
}

async function runSimulation() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log('Connected to MongoDB for simulation');

  // Clean previous data
  await Promise.all([
    Doctor.deleteMany({}),
    Slot.deleteMany({}),
    Token.deleteMany({}),
  ]);

  // Create 3 doctors
  const doctors = await Doctor.insertMany([
    { name: 'Dr. Alice' },
    { name: 'Dr. Bob' },
    { name: 'Dr. Charlie' },
  ]);

  // Create 2 slots each (total 6 slots)
  const slots = [];
  for (const doctor of doctors) {
    const created = await Slot.insertMany([
      {
        doctorId: doctor._id,
        startTime: '09:00',
        endTime: '10:00',
        capacity: 3,
        tokens: [],
      },
      {
        doctorId: doctor._id,
        startTime: '10:00',
        endTime: '11:00',
        capacity: 3,
        tokens: [],
      },
    ]);
    slots.push(...created);
  }

  const targetSlot = slots[0];

  // Book mixed token sources
  const t1 = await bookToken(targetSlot._id, {
    patientName: 'Patient Walkin 1',
    source: 'WALKIN',
  });
  const t2 = await bookToken(targetSlot._id, {
    patientName: 'Patient Online 1',
    source: 'ONLINE',
  });
  const t3 = await bookToken(targetSlot._id, {
    patientName: 'Patient Paid 1',
    source: 'PAID',
  });

  await printSlots('Before cancellations / no-shows / emergencies', [targetSlot]);

  // Cancel one token
  await cancelToken(t2._id);

  // Mark one no-show
  await markNoShow(t1._id);

  await printSlots('After cancel + no-show (before emergency)', [targetSlot]);

  // Insert emergency token (should evict lowest priority BOOKED token if full)
  const t4 = await bookToken(targetSlot._id, {
    patientName: 'Patient Followup 1',
    source: 'FOLLOWUP',
  });

  await printSlots('After adding a followup token', [targetSlot]);

  const { emergencyToken, evictedToken } = await addEmergencyToken(
    targetSlot._id,
    { patientName: 'Emergency Patient' }
  );

  await reallocateSlot(targetSlot._id);

  await printSlots('After emergency allocation & reallocation', [targetSlot]);

  if (evictedToken) {
    console.log(
      `Evicted token in simulation: ${evictedToken._id} (${evictedToken.patientName})`
    );
  }

  await mongoose.disconnect();
}

if (require.main === module) {
  runSimulation()
    .then(() => {
      console.log('\nSimulation completed');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Simulation failed', err);
      process.exit(1);
    });
}

