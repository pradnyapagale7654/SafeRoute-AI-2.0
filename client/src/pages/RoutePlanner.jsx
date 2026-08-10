import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function RoutePlanner() {
  return (
    <div className="min-h-screen bg-gray-100">

      <div className="bg-slate-900 text-white py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">
            🗺️ Safe Route Planner
          </h1>

          <p className="text-gray-300 mt-3">
            Find a safer route to your destination.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Route controls */}
          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-6">
              Plan Your Journey
            </h2>

            <label className="font-semibold">
              Starting Location
            </label>

            <input
              type="text"
              placeholder="Enter starting location"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-2 mb-5"
            />

            <button className="text-green-600 font-semibold mb-6">
              📍 Use My Current Location
            </button>

            <label className="font-semibold">
              Destination
            </label>

            <input
              type="text"
              placeholder="Where do you want to go?"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-2 mb-6"
            />

            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition">
              Find Safest Route
            </button>

          </div>

          {/* Real map */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-5">
              Route Map
            </h2>

            <div className="h-96 rounded-xl overflow-hidden">

              <MapContainer
                center={[18.5204, 73.8567]}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
              >

                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={[18.5204, 73.8567]}>
                  <Popup>
                    📍 Pune
                  </Popup>
                </Marker>

              </MapContainer>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RoutePlanner;