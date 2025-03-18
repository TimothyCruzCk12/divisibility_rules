import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const DivisibilityRules = () => {
  const [number, setNumber] = useState('');
  const [results, setResults] = useState([]);
  const [selectedDivisor, setSelectedDivisor] = useState(null);

  const rules = {
    1: { description: "Any number is divisible by 1." },
    2: { description: "If the last digit is divisible by 2 (0, 2, 4, 6, or 8)." },
    3: { description: "If the sum of its digits is divisible by 3." },
    4: { description: "If the number formed by the last two digits is divisible by 4." },
    5: { description: "If the last digit is 0 or 5." },
    6: { description: "If it's divisible by both 2 and 3." },
    7: { description: "If 2 times the last digit subtracted from the rest is divisible by 7." },
    8: { description: "If the number formed by the last three digits is divisible by 8." },
    9: { description: "If the sum of its digits is divisible by 9." },
    10: { description: "If the last digit is 0." }
  };

  // Initialize with empty input
  useEffect(() => {
    resetState();
  }, []);

  const resetState = () => {
    setResults([]);
    setSelectedDivisor(null);
  };

  const handleNumberChange = (e) => {
    const value = e.target.value;
    // Only allow digits (no 'e', '.', etc.)
    if (value === '' || /^\d+$/.test(value)) {
      // Check if the number is within the allowed range
      if (value === '' || parseInt(value) <= 1000000) {
        setNumber(value);
        resetState();
      }
    }
  };

  const checkDivisibility = () => {
    if (number === '') {
      setResults([{ message: 'Please enter a number to check.' }]);
      return;
    }

    const num = parseInt(number);
    const allRules = [];
    
    // Check each rule (1-10)
    for (let rule = 1; rule <= 10; rule++) {
      const isDivisible = num % rule === 0;
      allRules.push({
        rule,
        isDivisible,
        explanation: getExplanation(num, rule, isDivisible)
      });
    }

    setResults({
      allRules
    });
    
    // Set the first divisible number as selected if any
    const firstDivisible = allRules.find(r => r.isDivisible);
    if (firstDivisible) {
      setSelectedDivisor(firstDivisible.rule);
    } else {
      // If no divisible numbers (unlikely), select the first rule
      setSelectedDivisor(1);
    }
  };
  
  const getExplanation = (num, rule, isDivisible) => {
    const numStr = num.toString();
    const digits = numStr.split('').map(Number);
    
    if (isDivisible) {
      switch(rule) {
        case 1:
          return `All numbers are divisible by 1.`;
        
        case 2:
          const lastDigit = digits[digits.length - 1];
          return `The last digit (${lastDigit}) is ${lastDigit % 2 === 0 ? 'even' : 'odd'}, ${lastDigit % 2 === 0 ? 'so it' : 'but it still'} divides evenly by 2.`;
        
        case 3:
          const digitSum3 = digits.reduce((sum, digit) => sum + digit, 0);
          return `The sum of digits is ${digits.join('+')} = ${digitSum3}, which is divisible by 3.`;
        
        case 4:
          const lastTwoDigits = numStr.slice(-2);
          return `The last two digits (${lastTwoDigits}) form a number that is divisible by 4.`;
        
        case 5:
          const lastDigit5 = digits[digits.length - 1];
          return `The last digit is ${lastDigit5}, ${lastDigit5 === 0 || lastDigit5 === 5 ? 'which is either 0 or 5' : 'but it still divides evenly by 5'}.`;
        
        case 6:
          return `${num} is divisible by both 2 and 3, so it's divisible by 6.`;
        
        case 7:
          if (numStr.length === 1) {
            return `${num} is directly divisible by 7.`;
          } else {
            const lastDigit7 = digits[digits.length - 1];
            const restOfNumber = parseInt(numStr.slice(0, -1));
            const calculation = restOfNumber - (2 * lastDigit7);
            return `Using the rule: ${restOfNumber} - 2 × ${lastDigit7} = ${calculation}, which is divisible by 7.`;
          }
        
        case 8:
          if (numStr.length <= 3) {
            return `${num} is directly divisible by 8.`;
          } else {
            const lastThreeDigits = numStr.slice(-3);
            return `The last three digits (${lastThreeDigits}) form a number that is divisible by 8.`;
          }
        
        case 9:
          const digitSum9 = digits.reduce((sum, digit) => sum + digit, 0);
          return `The sum of digits is ${digits.join('+')} = ${digitSum9}, which is divisible by 9.`;
        
        case 10:
          const lastDigit10 = digits[digits.length - 1];
          return `The last digit is ${lastDigit10}, ${lastDigit10 === 0 ? 'which is 0' : 'but it still divides evenly by 10'}.`;
        
        default:
          return '';
      }
    } else {
      // Not divisible explanations
      switch(rule) {
        case 1:
          return `This is impossible - all numbers are divisible by 1.`;
        
        case 2:
          const lastDigit = digits[digits.length - 1];
          return `The last digit (${lastDigit}) is ${lastDigit % 2 === 0 ? 'even' : 'odd'}. Since it's ${lastDigit % 2 === 0 ? 'even' : 'odd'}, it's ${lastDigit % 2 === 0 ? '' : 'not'} divisible by 2.`;
        
        case 3:
          const digitSum3 = digits.reduce((sum, digit) => sum + digit, 0);
          return `The sum of digits is ${digits.join('+')} = ${digitSum3}. ${digitSum3} is not divisible by 3.`;
        
        case 4:
          const lastTwoDigits = numStr.slice(-2);
          return `The last two digits (${lastTwoDigits}) form a number that is not divisible by 4.`;
        
        case 5:
          const lastDigit5 = digits[digits.length - 1];
          return `The last digit is ${lastDigit5}, which is not 0 or 5.`;
        
        case 6:
          const divisibleBy2 = num % 2 === 0;
          const digitSum6 = digits.reduce((sum, digit) => sum + digit, 0);
          const divisibleBy3 = digitSum6 % 3 === 0;
          return `${num} is ${divisibleBy2 ? '' : 'not'} divisible by 2 and ${divisibleBy3 ? '' : 'not'} divisible by 3. To be divisible by 6, a number must be divisible by both 2 and 3.`;
        
        case 7:
          if (numStr.length === 1) {
            return `${num} is not one of the single-digit multiples of 7 (0, 7).`;
          } else {
            const lastDigit7 = digits[digits.length - 1];
            const restOfNumber = parseInt(numStr.slice(0, -1));
            const calculation = restOfNumber - (2 * lastDigit7);
            return `Using the rule: ${restOfNumber} - 2 × ${lastDigit7} = ${calculation}. ${calculation} is not divisible by 7.`;
          }
        
        case 8:
          if (numStr.length <= 3) {
            return `${num} is not divisible by 8. For numbers up to 3 digits, they must be a direct multiple of 8.`;
          } else {
            const lastThreeDigits = numStr.slice(-3);
            return `The last three digits (${lastThreeDigits}) form a number that is not divisible by 8.`;
          }
        
        case 9:
          const digitSum9 = digits.reduce((sum, digit) => sum + digit, 0);
          return `The sum of digits is ${digits.join('+')} = ${digitSum9}. ${digitSum9} is not divisible by 9.`;
        
        case 10:
          const lastDigit10 = digits[digits.length - 1];
          return `The last digit is ${lastDigit10}, which is not 0. A number is only divisible by 10 if it ends in 0.`;
        
        default:
          return `${num} ÷ ${rule} = ${Math.floor(num/rule)} with remainder ${num % rule}`;
      }
    }
  };

  // Determine if we should show results section
  const showResults = Array.isArray(results) && results.length > 0 || 
                      !Array.isArray(results) && results.allRules && results.allRules.length > 0;

  return (
    <div className="w-full max-w-md mx-auto shadow-md bg-white rounded-lg overflow-hidden">
      <div className="p-3 space-y-3">
        <div className="space-y-2">
          <div className="flex flex-col space-y-1">
            <label htmlFor="numberInput" className="block text-sm font-medium text-gray-700">Number to test:</label>
            <div className="flex space-x-2">
              <input
                id="numberInput"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={number}
                onChange={handleNumberChange}
                placeholder="Enter (1-1,000,000)"
                className="w-full text-base p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button 
                onClick={checkDivisibility} 
                className="px-2 bg-green-500 hover:bg-green-600 text-white text-sm py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={number === ''}
              >
                Check
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {showResults && (
        <div className="p-3 flex flex-col items-start bg-gray-50 rounded-b-lg space-y-2">
          {Array.isArray(results) ? (
            results.map((result, index) => (
              <div key={index} className="w-full p-2 mb-1 bg-red-50 border border-red-200 rounded-md flex items-start">
                <AlertCircle className="h-4 w-4 text-red-500 mr-1 mt-0.5" />
                <p className="text-red-600 text-xs">
                  {result.message}
                </p>
              </div>
            ))
          ) : (
            <div className={`w-full p-2 mb-1 ${selectedDivisor && !results.allRules.find(r => r.rule === selectedDivisor)?.isDivisible ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'} rounded-md`}>
              <div className="flex items-start">
                {selectedDivisor && !results.allRules.find(r => r.rule === selectedDivisor)?.isDivisible ? 
                  <AlertCircle className="h-4 w-4 text-red-500 mr-1 mt-0.5" /> :
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1 mt-0.5" />
                }
                <div className="w-full">
                  <h3 className={`${selectedDivisor && !results.allRules.find(r => r.rule === selectedDivisor)?.isDivisible ? 'text-red-700' : 'text-green-700'} text-sm font-medium`}>
                    Divisibility result for {number}:
                  </h3>
                  
                  <div className="flex items-center justify-center space-x-2 my-2">
                    <button 
                      className="p-0 h-6 w-6 rounded-full bg-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-300 flex items-center justify-center"
                      onClick={() => {
                        const currentRule = selectedDivisor;
                        const prevRule = currentRule > 1 ? currentRule - 1 : 10;
                        setSelectedDivisor(prevRule);
                      }}
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </button>
                    
                    <div className="flex flex-wrap justify-center gap-1 max-w-xs">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rule => {
                        const result = results.allRules.find(r => r.rule === rule);
                        return (
                          <span 
                            key={rule}
                            className={`px-2 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors 
                              ${result?.isDivisible 
                                ? selectedDivisor === rule 
                                  ? 'bg-green-500 text-white font-bold' 
                                  : 'bg-green-100 text-green-700 hover:bg-green-200' 
                                : selectedDivisor === rule
                                  ? 'bg-red-500 text-white font-bold'
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                            onClick={() => setSelectedDivisor(rule)}
                          >
                            {rule}
                          </span>
                        );
                      })}
                    </div>
                    
                    <button 
                      className="p-0 h-6 w-6 rounded-full bg-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-300 flex items-center justify-center"
                      onClick={() => {
                        const currentRule = selectedDivisor;
                        const nextRule = currentRule < 10 ? currentRule + 1 : 1;
                        setSelectedDivisor(nextRule);
                      }}
                    >
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                  
                  {selectedDivisor && (
                    <div className={`mt-2 p-2 bg-white rounded-md border ${results.allRules.find(r => r.rule === selectedDivisor)?.isDivisible ? 'border-green-200' : 'border-red-200'}`}>
                      <h4 className={`font-medium ${results.allRules.find(r => r.rule === selectedDivisor)?.isDivisible ? 'text-green-700' : 'text-red-700'} text-xs mb-0.5`}>
                        Rule for divisibility by {selectedDivisor}:
                      </h4>
                      <p className={`text-xs ${results.allRules.find(r => r.rule === selectedDivisor)?.isDivisible ? 'text-green-600' : 'text-red-600'} mb-1`}>
                        {rules[selectedDivisor].description}
                      </p>
                      <div className={`pt-1 border-t ${results.allRules.find(r => r.rule === selectedDivisor)?.isDivisible ? 'border-green-100' : 'border-red-100'}`}>
                        <h4 className={`font-medium ${results.allRules.find(r => r.rule === selectedDivisor)?.isDivisible ? 'text-green-700' : 'text-red-700'} text-xs mb-0.5`}>
                          {results.allRules.find(r => r.rule === selectedDivisor)?.isDivisible ? 'Explanation:' : 'Why not divisible:'}
                        </h4>
                        <p className={`text-xs ${results.allRules.find(r => r.rule === selectedDivisor)?.isDivisible ? 'text-green-600' : 'text-red-600'}`}>
                          {results.allRules.find(r => r.rule === selectedDivisor)?.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DivisibilityRules;