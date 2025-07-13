const isCheckinAllowed = (showtime) => {
    if (!showtime?.date || !showtime?.timeSlot) return false;

    const [hours, minutes] = showtime.timeSlot.split(':');
    const showDateTime = new Date(showtime.date);
    showDateTime.setHours(parseInt(hours));
    showDateTime.setMinutes(parseInt(minutes));
    showDateTime.setSeconds(0);
    showDateTime.setMilliseconds(0);

    const now = new Date();
    const oneHourBeforeShow = new Date(showDateTime.getTime() - 60 * 60 * 1000);

    return now >= oneHourBeforeShow;
};

module.exports = {
    isCheckinAllowed,
};