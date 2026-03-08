1️⃣ What is the difference between var, let, and const?
Answer :
In modern JavaScript, the primary differences lie in scope and reassignability. var is the oldest declaration method and is function-scoped, meaning it is available throughout the entire function it is defined in, regardless of block levels like loops or if-statements. It is also hoisted and initialized as undefined, which can lead to logical errors.

In contrast, let and const are block-scoped, meaning they only exist within the specific set of curly braces {} where they are defined. This prevents variable "leakage" and makes code more predictable. While let allows you to reassign a variable's value later, const (short for constant) requires an immediate value upon declaration and cannot be reassigned. In professional development, it is best practice to use const by default, let for values that must change, and avoid var entirely to prevent scoping bugs.

2️⃣ What is the spread operator (...)?
Answer :
The spread operator (...) is a syntax used to "unpack" or expand the elements of an array or the properties of an object into a new location.
For Arrays: It’s commonly used to merge multiple arrays or create a "shallow copy" without affecting the original.
Example: [...arr1, ...arr2] combines two arrays into one.
For Objects: It allows you to copy properties from one object to another or update specific values while keeping the rest unchanged.
Example: { ...user, age: 25 } copies all user data but updates the age.
For Functions: it lets you pass an array as individual arguments to a function that normally expects separate values.

3️⃣ What is the difference between map(), filter(), and forEach()?
Answer :
The differences between map(), filter(), and forEach() depend on whether you want to transform data, select data, or simply execute an action.
1. map() — The Transformer
Use map() when you want to create a new array by applying a function to every element of the original array. It takes each item, changes it based on your logic, and "maps" it to a corresponding position in a brand-new array of the same length.
Returns: A new array of the same length.
Use case: Converting a list of prices into a list of formatted strings (e.g., 10 → "$10.00").

2. filter() — The Decider
Use filter() when you want to create a new array containing only the elements that pass a specific condition (a "test"). It checks each item; if the condition is true, the item stays; if false, it's skipped.
Returns: A new array (usually shorter than the original).
Use case: Getting only the "Open" issues from a full list of bug reports.

3. forEach() — The Doer
Use forEach() when you want to perform an action (a side effect) for each element, but you don't need a new array back. It simply loops through the items and executes your code.
Returns: undefined (it returns nothing).
Use case: Logging every item to the console or manually updating elements in the DOM.

4️⃣ What is an arrow function?
Answer :
An arrow function is a concise way to write functions using the => syntax. It’s designed to be cleaner and solve specific scoping issues found in traditional functions.
Syntax: It removes the function keyword. If the code is a single line, you can also omit the curly braces and the return keyword (Implicit Return).
The this Keyword: Unlike regular functions, arrow functions do not have their own this. They inherit it from the parent scope, which is incredibly useful for maintaining context in callbacks or timers.
Limitations: They cannot be used as constructors (with new), and they aren't hoisted, so they must be defined before they are called.

5️⃣ What are template literals?
Answer :
Template literals are modern strings defined by backticks (`) instead of quotes. They simplify how you handle text in three main ways:
Interpolation: You can insert variables or math directly into the string using ${expression}. No more messy + signs.
Multi-line Support: You can hit "Enter" to start a new line naturally. In regular strings, you’d have to use \n.
HTML Templates: They are the standard way to write dynamic HTML inside JavaScript .