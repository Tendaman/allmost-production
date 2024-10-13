'use client';

import React, { useState, useEffect } from 'react';
import { BadgeDelta } from '@tremor/react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const TransitionHistory = ({ totalClosedSessions, currency }) => {
  const [percentageChange, setPercentageChange] = useState(0);
  const [changeType, setChangeType] = useState<'increase' | 'decrease' | 'unchanged'>('unchanged');

  useEffect(() => {
    if (totalClosedSessions && totalClosedSessions.length >= 2) {
      const latestTransaction = totalClosedSessions[0].amount_total;
      const previousTransaction = totalClosedSessions[1].amount_total;
      
      if (previousTransaction !== 0) {
        const change = ((latestTransaction - previousTransaction) / Math.abs(previousTransaction)) * 100;
        setPercentageChange(change); 
        setChangeType(change >= 0 ? 'increase' : 'decrease');
      } else {
        setPercentageChange(0);  // Avoid division by zero
        setChangeType('unchanged');
      }
    }
  }, [totalClosedSessions]);

  // Function to format percentage based on whether it has decimal places
  const formatPercentage = (value) => {
    return value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
  };

  return (
    <Card className="p-4 flex-1 h-[450px] overflow-auto relative">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Transition History
          {percentageChange !== 0 && (
            <BadgeDelta
              className={`rounded-xl bg-transparent text-${
                changeType === 'increase' ? 'green-500' : 'red-500'
              }`}
              deltaType={changeType === 'increase' ? 'moderateIncrease' : 'moderateDecrease'}
              isIncreasePositive={changeType === 'increase'}
              size="xs"
            >
              {changeType === 'increase' ? '+' : '-'}
              {formatPercentage(Math.abs(percentageChange))}% 
            </BadgeDelta>
          )}
        </CardTitle>
        <Table>
          <TableHeader className="!sticky !top-0">
            <TableRow>
              <TableHead className="w-[300px]">Email</TableHead>
              <TableHead className="w-[200px]">Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="font-medium truncate">
            {totalClosedSessions
              ? totalClosedSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      {session.customer_details?.email || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-500 dark:text-black">
                        Paid
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(session.created).toUTCString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <small>{currency}</small>{' '}
                      <span className="text-emerald-500">
                        {session.amount_total}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              : 'No Data'}
          </TableBody>
        </Table>
      </CardHeader>
    </Card>
  );
};

export default TransitionHistory;