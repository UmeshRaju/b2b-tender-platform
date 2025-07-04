// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} B2B Tender Platform. All rights reserved.(just for demo purposes)</p>
        <div className="space-x-4 mt-2 md:mt-0">
          <a href="/tenders" className="hover:underline">Tenders</a>
          <a href="/companies" className="hover:underline">Companies</a>
          <a href="/login" className="hover:underline">Login</a>
        </div>
      </div>
    </footer>
  );
}
