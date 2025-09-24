export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">Tailwind CSS Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Basic Styles</h2>
            <p className="text-gray-600 mb-4">This is a test paragraph with basic text styling.</p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Test Button
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Colors</h2>
            <div className="space-y-2">
              <div className="w-full h-8 bg-red-500 rounded"></div>
              <div className="w-full h-8 bg-green-500 rounded"></div>
              <div className="w-full h-8 bg-blue-500 rounded"></div>
              <div className="w-full h-8 bg-yellow-500 rounded"></div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Responsive Design</h2>
          <div className="text-sm md:text-base lg:text-lg">
            <p className="text-gray-600">This text should be responsive across different screen sizes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
