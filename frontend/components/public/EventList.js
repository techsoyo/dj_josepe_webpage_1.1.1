import React from 'react';

const EventList = ({ events }) => {
  if (!events || events.length === 0) {
    return <p className="text-center text-gray-600">No hay próximos eventos en este momento.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          {event.imageUrl && (
            <img src={event.imageUrl} alt={event.name} className="w-full h-48 object-cover" />
          )}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
            <p className="text-gray-700 mb-1"><strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p className="text-gray-700 mb-1"><strong>Hora:</strong> {event.time}</p>
            <p className="text-gray-700 mb-4"><strong>Lugar:</strong> {event.location}</p>
            {event.ticketUrl && (
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Comprar Entradas
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;

