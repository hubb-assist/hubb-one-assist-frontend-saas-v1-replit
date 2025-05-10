export default function ProjectStructure() {
  return (
    <div className="py-6 border-b border-gray-200">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Estrutura de pastas</h3>
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 overflow-auto" style={{ maxHeight: "300px" }}>
        <pre className="text-xs text-gray-700 font-mono whitespace-pre">
{`src/
├── components/
├── pages/
├── styles/
├── lib/
├── hooks/
├── context/
├── config/
├── assets/
├── App.tsx
├── main.tsx
├── index.css`}
        </pre>
      </div>
    </div>
  );
}
