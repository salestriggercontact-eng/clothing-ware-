const r = require('express').Router();
const ah = require('../utils/ah');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const { protect, admin } = require('../middleware/auth');

const validDT = (d, t) => /^\d{4}-\d{2}-\d{2}$/.test(d || '') && /^\d{2}:\d{2}$/.test(t || '') && new Date(`${d}T${t}`) > new Date();

r.post('/', protect, ah(async (req, res) => {
  const { service, date, time, note } = req.body;
  const s = await Service.findOne({ _id: service, isActive: true });
  if (!s) return res.status(400).json({ message: 'Choose a service' });
  if (!validDT(date, time)) return res.status(400).json({ message: 'Choose a future date and time' });
  const a = await Appointment.create({
    user: req.user._id, service: s._id, serviceName: s.name, serviceSubtitle: s.subtitle,
    image: s.image, location: s.location, date, time, note,
  });
  res.status(201).json(a);
}));

r.get('/mine', protect, ah(async (req, res) => res.json(await Appointment.find({ user: req.user._id }).sort({ date: 1, time: 1 }))));

r.put('/:id/reschedule', protect, ah(async (req, res) => {
  const a = await Appointment.findOne({ _id: req.params.id, user: req.user._id });
  if (!a || a.status !== 'Upcoming') return res.status(400).json({ message: 'Only upcoming appointments can be rescheduled' });
  if (!validDT(req.body.date, req.body.time)) return res.status(400).json({ message: 'Choose a future date and time' });
  a.date = req.body.date; a.time = req.body.time;
  await a.save();
  res.json(a);
}));

r.put('/:id/cancel', protect, ah(async (req, res) => {
  const a = await Appointment.findOne({ _id: req.params.id, user: req.user._id });
  if (!a || a.status !== 'Upcoming') return res.status(400).json({ message: 'Only upcoming appointments can be cancelled' });
  a.status = 'Cancelled';
  await a.save();
  res.json(a);
}));

r.get('/admin/all', protect, admin, ah(async (req, res) =>
  res.json(await Appointment.find().populate('user', 'name phone email').sort({ date: -1, time: -1 }).limit(500))));

r.put('/:id/status', protect, admin, ah(async (req, res) => {
  const a = await Appointment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true }).populate('user', 'name phone email');
  if (!a) return res.status(404).json({ message: 'Appointment not found' });
  res.json(a);
}));

module.exports = r;
