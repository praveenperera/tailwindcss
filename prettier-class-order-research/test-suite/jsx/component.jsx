import React from 'react';

// Test 1: className attribute
export function BasicComponent() {
  return (
    <div className="p-4 bg-red-500 m-2 text-white flex">
      Basic component
    </div>
  );
}

// Test 2: Template expressions in className
export function DynamicComponent({ isActive }) {
  return (
    <div className={`p-4 ${isActive ? 'bg-blue-500' : 'bg-gray-500'} flex items-center`}>
      Dynamic classes
    </div>
  );
}

// Test 3: Conditional classes
export function ConditionalComponent({ highlight }) {
  return (
    <div className={`
      p-4
      flex
      ${highlight ? 'bg-yellow-500 shadow-lg' : 'bg-white'}
      md:grid
      lg:block
    `}>
      Conditional classes
    </div>
  );
}

// Test 4: Complex responsive layout
export function ResponsiveCard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 lg:p-10 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        Card Title
      </h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        Card content
      </p>
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
        Click me
      </button>
    </div>
  );
}

// Test 5: Grid layout
export function GridComponent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8">
      <div className="bg-gray-100 p-4 rounded">Item 1</div>
      <div className="bg-gray-200 p-4 rounded">Item 2</div>
      <div className="bg-gray-300 p-4 rounded">Item 3</div>
    </div>
  );
}

// Test 6: Flexbox alignment
export function FlexComponent() {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50">
      <span className="font-semibold text-lg">Left</span>
      <span className="text-gray-600">Right</span>
    </div>
  );
}

// Test 7: Form elements
export function FormComponent() {
  return (
    <form className="space-y-4 max-w-lg mx-auto p-6">
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter text"
      />
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
      >
        Submit
      </button>
    </form>
  );
}

// Test 8: Arbitrary values
export function ArbitraryComponent() {
  return (
    <div className="bg-[#1da1f2] w-[100px] h-[50px] m-[10px] p-[2rem] rounded-[12px]">
      Arbitrary values
    </div>
  );
}

// Test 9: Negative values
export function NegativeComponent() {
  return (
    <div className="-mt-4 -ml-2 -z-10 -inset-x-4">
      Negative values
    </div>
  );
}

// Test 10: Pseudo-classes
export function PseudoComponent() {
  return (
    <div className="hover:bg-blue-500 focus:ring-2 active:scale-95 visited:text-purple-600">
      Pseudo-classes
    </div>
  );
}
