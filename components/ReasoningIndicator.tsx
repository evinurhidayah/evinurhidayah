/**
 * ReasoningIndicator Component
 * 
 * Visual indicator showing AI's multi-turn reasoning process
 * Displays iterative thinking steps transparently to user
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Search, CheckCircle, AlertCircle } from 'lucide-react';
import type { ReasoningStep } from '../utils/reasoningEngine';

interface ReasoningIndicatorProps {
  steps: ReasoningStep[];
  currentIteration?: number;
  isComplete: boolean;
}

export const ReasoningIndicator: React.FC<ReasoningIndicatorProps> = ({
  steps,
  currentIteration,
  isComplete
}) => {
  if (steps.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-3 space-y-2"
    >
      <div className="flex items-center gap-2 text-xs text-purple-400 font-medium">
        <Brain className="w-4 h-4 animate-pulse" />
        <span>Thinking Process {currentIteration && `(Iteration ${currentIteration})`}</span>
      </div>

      <div className="space-y-1.5">
        {steps.map((step, index) => (
          <motion.div
            key={step.stepNumber}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/40 border border-purple-500/20 rounded-lg p-2.5"
          >
            {/* Step header */}
            <div className="flex items-start gap-2 mb-1.5">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-xs text-purple-300 font-bold">
                {step.stepNumber}
              </div>
              <div className="flex-1 min-w-0">
                {/* Thought */}
                {step.thought && (
                  <p className="text-xs text-gray-300 leading-relaxed">
                    💭 {step.thought}
                  </p>
                )}

                {/* Action */}
                {step.action && (
                  <div className="mt-1.5 flex items-start gap-1.5">
                    {step.action.type === 'search' && (
                      <>
                        <Search className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-cyan-300 font-medium">
                            Searching: "{step.action.query}"
                          </p>
                          {step.action.purpose && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {step.action.purpose}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Observation */}
                {step.observation && step.action?.type === 'search' && (
                  <div className="mt-1.5 text-xs text-green-400">
                    ✓ Found information
                  </div>
                )}

                {/* Reflection */}
                {step.reflection && (
                  <div className="mt-1.5 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-300 flex-1">
                      {step.reflection}
                    </p>
                  </div>
                )}

                {/* Complete indicator */}
                {step.isComplete && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-green-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Ready to answer</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {!isComplete && (
        <div className="flex items-center gap-2 text-xs text-purple-400 animate-pulse">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" />
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
          <span className="ml-1">Continuing to think...</span>
        </div>
      )}
    </motion.div>
  );
};
