import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardFooter } from '../components/ui/card';

const DivisibilityRules = () => {
  const [number, setNumber] = useState('');
  const [results, setResults] = useState([]);
  const [selectedDivisor, setSelectedDivisor] = useState(null);

  const rules = {
    1: { description: "Any number is divisible by 1.", example: "15 ÷ 1 = 15 (no remainder)" },
    2: { description: "If the last digit is divisible by 2 (0, 2, 4, 6, or 8).", example: "24 is divisible by 2 because 4 is divisible by 2" },
    3: { description: "If the sum of its digits is divisible by 3.", example: "126 → 1+2+6 = 9, and 9 is divisible by 3" },
    4: { description: "If the number formed by the last two digits is divisible by 4.", example: "1624 is divisible by 4 because 24 is divisible by 4" },
    5: { description: "If the last digit is 0 or 5.", example: "125 is divisible by 5 because it ends in 5" },
    6: { description: "If it's divisible by both 2 and 3.", example: "126 is divisible by 6 because it's divisible by 2 and 3" },
    7: { description: "If 2 times the last digit subtracted from the rest is divisible by 7.", example: "371 → 37 - (2 * 1) = 35, which is divisible by 7" },
    8: { description: "If the number formed by the last three digits is divisible by 8.", example: "1624 is divisible by 8 because 624 is divisible by 8" },
    9: { description: "If the sum of its digits is divisible by 9.", example: "1647 → 1+6+4+7 = 18, and 18 is divisible by 9" },
    10: { description: "If the last digit is 0.", example: "1650 is divisible by 10 because it ends in 0" }
  };

  const generateRandomNumber = () => {
    const newNumber = Math.floor(Math.random() * 1000) + 1;
    setNumber(newNumber.toString());
    resetState();
  };

  // Initialize with an empty input field instead of random number
  useEffect(() => {
    // No auto-generation of random number on load
    setNumber('');
    resetState();
  }, []);

  const resetState = () => {
    setResults([]);
    setSelectedDivisor(null);
  };

  const handleNumberChange = (e) => {
    const value = e.target.value;
    // Allow empty value or valid numbers up to 1000
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) <= 1000)) {
      setNumber(value);
      resetState();
    }
  };

  const checkDivisibility = () => {
    if (number === '') {
      setResults([{ status: 'error', message: 'Please enter a number to check.' }]);
      return;
    }

    const num = parseInt(number);
    const allRules = Object.keys(rules).map(Number);
    
    // Split results into correct (divisible) and incorrect (not divisible)
    const correctRules = [];
    const incorrectRules = [];
    
    allRules.forEach(rule => {
      const isDivisible = num % rule === 0;
      if (isDivisible) {
        // Add explanation for why the number is divisible by this rule
        const explanation = getExplanation(num, rule);
        correctRules.push({
          rule,
          message: `${num} is divisible by ${rule}`,
          explanation
        });
      } else {
        incorrectRules.push(rule);
      }
    });

    setResults({
      correct: correctRules,
      incorrect: incorrectRules
    });
    
    // Set the first divisible number as selected if there are any
    if (correctRules.length > 0) {
      setSelectedDivisor(correctRules[0].rule);
    }
  };
  
  // Function to generate explanations for each divisibility rule
  const getExplanation = (num, rule) => {
    const numStr = num.toString();
    const digits = numStr.split('').map(Number);
    
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
  };

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <Card className="w-full max-w-2xl mx-auto shadow-md bg-white">
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="numberInput" className="block text-xl font-medium text-gray-700">Number to test:</label>
              <div className="flex items-center space-x-4">
                <div className="flex-grow">
                  <Input
                    id="numberInput"
                    type="number"
                    value={number}
                    onChange={handleNumberChange}
                    placeholder="Enter a number (1-1000)"
                    className="w-full text-lg border-sky-200 focus:border-sky-400"
                    min="1"
                    max="1000"
                  />
                </div>
                <Button onClick={generateRandomNumber} className="flex items-center bg-sky-500 hover:bg-sky-600 text-white h-10 whitespace-nowrap">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Random
                </Button>
              </div>
            </div>
            <Button 
              onClick={checkDivisibility} 
              className="w-full bg-emerald-400 hover:bg-emerald-500 text-white text-xl py-6"
              disabled={number === ''}
            >
              Check Divisibility
            </Button>
          </div>
        </CardContent>
        <CardFooter className={`flex-col items-start bg-gray-50 pt-6 rounded-b-lg ${(Array.isArray(results) && results.length === 0) || (!Array.isArray(results) && (!results.correct || results.correct.length === 0) && (!results.incorrect || results.incorrect.length === 0)) ? 'hidden' : ''}`}>
          {Array.isArray(results) ? (
            // Display error message if any
            results.map((result, index) => (
              <Alert key={index} className="w-full mb-2 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-600 text-base">
                  {result.message}
                </AlertDescription>
              </Alert>
            ))
          ) : (
            // Display correct rules followed by incorrect rules
            <>
              {results.correct && results.correct.length > 0 && (
                <Alert className="w-full mb-2 bg-emerald-50 border-emerald-200">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <AlertTitle className="text-emerald-700 text-lg">{number} is divisible by:</AlertTitle>
                  <AlertDescription className="text-emerald-600 text-base w-full">
                    <div className="flex items-center justify-center space-x-4 my-2">
                      {results.correct.length > 1 && (
                        <Button 
                          size="sm"
                          className="p-0 h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-200 border-none"
                          onClick={() => {
                            const currentIndex = results.correct.findIndex(item => item.rule === selectedDivisor);
                            const prevIndex = currentIndex > 0 ? currentIndex - 1 : results.correct.length - 1;
                            setSelectedDivisor(results.correct[prevIndex].rule);
                          }}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                      )}
                      
                      <div className="flex flex-wrap justify-center gap-2">
                        {results.correct.map(result => (
                          <span 
                            key={result.rule}
                            className={`px-4 py-2 text-lg font-medium rounded-full cursor-pointer transition-colors ${selectedDivisor === result.rule ? 'bg-emerald-500 text-white font-bold' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                            onClick={() => setSelectedDivisor(result.rule)}
                          >
                            {result.rule}
                          </span>
                        ))}
                      </div>
                      
                      {results.correct.length > 1 && (
                        <Button 
                          size="sm"
                          className="p-0 h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-200 border-none"
                          onClick={() => {
                            const currentIndex = results.correct.findIndex(item => item.rule === selectedDivisor);
                            const nextIndex = (currentIndex + 1) % results.correct.length;
                            setSelectedDivisor(results.correct[nextIndex].rule);
                          }}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                    
                    {selectedDivisor && (
                      <div className="mt-4 p-3 bg-white rounded-md border border-emerald-200">
                        <h4 className="font-medium text-emerald-700 mb-1">Rule for divisibility by {selectedDivisor}:</h4>
                        <p className="text-sm text-emerald-600 mb-2">{rules[selectedDivisor].description}</p>
                        <div className="pt-2 border-t border-emerald-100">
                          <h4 className="font-medium text-emerald-700 mb-1">Explanation:</h4>
                          <p className="text-sm text-emerald-600">
                            {results.correct.find(r => r.rule === selectedDivisor)?.explanation}
                          </p>
                        </div>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
              
              {results.incorrect && results.incorrect.length > 0 && (
                <Alert className="w-full mb-2 bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertTitle className="text-red-700 text-lg">Not Divisible</AlertTitle>
                  <AlertDescription className="text-red-600 text-base">
                    {number} is not divisible by: {results.incorrect.join(', ')}
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default DivisibilityRules;