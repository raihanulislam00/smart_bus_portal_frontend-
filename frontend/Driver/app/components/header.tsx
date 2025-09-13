export default function Header() {
  return (
    <header className="bg-white shadow-md p-4">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">
           Smart Bus Portal
        </div>
        <nav className="flex space-x-4">
          <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="/login" className="text-gray-700 hover:text-blue-600">Login</a>
          <a href="/signup" className="text-gray-700 hover:text-blue-600">Signup</a>
        </nav>
      </div>
    </header>
  );
}
