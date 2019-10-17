
export const intervalCoordinates = (io, socket) => {
  let count = 0;
  const intervar = setInterval(() => {
    if (count === 10) {
      clearInterval(intervar);
    }
    io.to(adminRoomName).emit('message-coordinates', {
      id: socket.id,
      coordinates: {
        lat: Number(`55.75${count}`),
        lon: Number(`37.57${count}`),
      },
    });
    count += 1;
    return false;
  }, 1000);
};
