const Booking = require('../models/bookingSchema');
const { isCheckinAllowed } = require('../utils/checkinUtil');

// Create booking
const createBooking = async (req, res) => {
    try {
        const booking = new Booking({
            user: req.user._id,
            showtime: req.body.showtime,
            bookedSeats: req.body.seats,
            movie: req.body.movie,
            totalPrice: req.body.totalPrice,
        });
        await booking.save();
        res.status(201).json({
            status: 'success',
            message: 'Booking created successfully',
            data: { booking },
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};

// Get all bookings for a user
const getUserBookings = async (req, res) => {
    try {
        let bookings = await Booking.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .lean();

        bookings = bookings.map(booking => {
            if (booking.showtime) {
                delete booking.showtime.movieId;
                if (booking.showtime.screenId) {
                    delete booking.showtime.screenId.layout;
                }
            }
            return booking;
        });

        res.status(200).json({
            "status": "success",
            "data": bookings
        });
    } catch (error) {
        res.status(500).json({
            "status": "error",
            "message": error.message
        });
    }
};

// Get all bookings
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json({
            "status": "success",
            "data": bookings
        });
    } catch (error) {
        res.status(500).json({
            "status": "error",
            "message": error
        });
    }
};

const getBookedSeats = async (req, res) => {
    const { showtimeId, screenId } = req.params;
    try {
        const bookings = await Booking.find({
            'showtime._id': showtimeId,
            'showtime.screenId._id': screenId
        });
        const bookedSeats = bookings.reduce((acc, booking) => {
            booking.bookedSeats.forEach(seat => {
                const existingRow = acc.find(row => row.row === seat.row);
                if (existingRow) {
                    existingRow.seats.push(...seat.seats);
                } else {
                    acc.push({ row: seat.row, seats: [...seat.seats] });
                }
            });
            return acc;
        }, []);
        res.status(200).json({
            status: 'success',
            message: 'Booked seats fetched successfully',
            data: { bookedSeats },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching booked seats',
        });
    }
};

// Update booking
const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.bookingId, req.body, { new: true });
        res.status(200).json({
            status: 'success',
            message: 'Booking updated successfully',
            data: { booking },
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};

// Delete booking
const deleteBooking = async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.bookingId);
        res.status(200).json({
            status: 'success',
            message: 'Booking deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};

// Booking checkin
const checkBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({
                status: 'error',
                message: 'Booking not found',
            });
        }

        switch (booking.status) {
            case 'checked':
                return res.status(400).json({
                    status: 'error',
                    message: 'Booking already checked',
                });

            case 'expired':
                return res.status(400).json({
                    status: 'error',
                    message: 'Booking expired',
                });

            case 'booked':
                if (!isCheckinAllowed(booking.showtime)) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Check-in not allowed before 1 hour of showtime',
                    });
                }

                booking.status = 'checked';
                await booking.save();
                return res.status(200).json({
                    status: 'success',
                    message: 'Booking checked successfully',
                    data: { booking },
                });

            default:
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid booking status',
                });
        }
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error checking booking',
        });
    }
};

module.exports = {
    createBooking,
    getUserBookings,
    getAllBookings,
    getBookedSeats,
    updateBooking,
    deleteBooking,
    checkBooking,
};