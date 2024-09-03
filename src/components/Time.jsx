import React, { useState, useEffect } from 'react';

function Time() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-xl text-center mb-4 text-gray-800">
      {time.toLocaleTimeString()}
    </div>
  );
}

export default Time;
