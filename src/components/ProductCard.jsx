function ProductCard({ producto }) {
  const { nombre, tipoPresentacion, precio, disponible, imagenUrl } = producto;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        <div className="h-44 bg-gray-100 relative overflow-hidden flex items-center justify-center">
          {imagenUrl ? (
            <img src={imagenUrl} alt={nombre} className="w-full h-full object-cover" />
          ) : (
            <span className="text-5xl text-gray-300">🍦</span>
          )}
          <span
            className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
              disponible ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
            }`}
          >
            {disponible ? '✓ Disponible' : '✕ No disponible'}
          </span>
        </div>
        <div className="p-4">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
            {tipoPresentacion}
          </span>
          <h3 className="text-lg font-bold text-gray-800 mt-1">{nombre}</h3>
        </div>
      </div>
      <div className="p-4 pt-0 flex items-center justify-between border-t border-gray-50 mt-2">
        <span className="text-2xl font-extrabold text-pink-600">
          ${precio.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export default ProductCard;