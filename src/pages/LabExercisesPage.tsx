import React from 'react';
import { FetchMachine } from '@/components/lab/FetchMachine';
import { Tabs } from '@/components/lab/Tabs';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LabExercisesPage = () => {
  return (
    <div className="p-8 space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Lab 5: Advanced React Exercises</h1>
        <p className="text-muted-foreground">Practical demonstration of Module 5 concepts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* EXERCISE 1.1 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 font-bold">1</div>
             <h2 className="text-xl font-semibold">Complex State (useReducer)</h2>
          </div>
          <FetchMachine />
        </section>

        {/* EXERCISE 3.1 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 font-bold">3</div>
             <h2 className="text-xl font-semibold">Compound Components</h2>
          </div>
          
          <div className="p-6 border rounded-xl bg-card shadow-sm">
            <h3 className="font-semibold text-lg mb-4">Exercise 3.1: Reusable Tabs</h3>
            <Tabs defaultIndex={0}>
                <Tabs.List>
                    <Tabs.Tab index={0}>React</Tabs.Tab>
                    <Tabs.Tab index={1}>Redux Toolkit</Tabs.Tab>
                    <Tabs.Tab index={2}>Performance</Tabs.Tab>
                </Tabs.List>
                <div className="p-4 bg-secondary/20 rounded-lg min-h-[100px]">
                    <Tabs.Panel index={0}>
                        <p className="font-medium text-blue-500">React Core</p>
                        <p className="text-sm mt-2 text-muted-foreground">React makes it painless to create interactive UIs. Design simple views for each state in your application.</p>
                    </Tabs.Panel>
                    <Tabs.Panel index={1}>
                        <p className="font-medium text-purple-500">Redux Toolkit (RTK)</p>
                        <p className="text-sm mt-2 text-muted-foreground">The official, opinionated, batteries-included toolset for efficient Redux development. (Used in InventorySlice).</p>
                    </Tabs.Panel>
                    <Tabs.Panel index={2}>
                        <p className="font-medium text-green-500">Optimization</p>
                        <p className="text-sm mt-2 text-muted-foreground">Using React.memo, useMemo, and Virtualization to handle 5000+ items seamlessly.</p>
                    </Tabs.Panel>
                </div>
            </Tabs>
          </div>
        </section>
      </div>

      {/* OTHER EXERCISES EVIDENCE */}
      <section className="pt-8 border-t">
        <h2 className="text-xl font-semibold mb-6">Other Completed Requirements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Ex 1.2 */}
            <div className="p-4 border rounded-lg bg-secondary/10">
                <div className="flex items-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <h3 className="font-bold">Ex 1.2: Global Store</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Implemented using Redux Toolkit (configureStore, createSlice, createAsyncThunk).</p>
                <Link to="/dashboard/inventory"><Button variant="outline" size="sm" className="w-full">View Inventory Redux</Button></Link>
            </div>

            {/* Ex 2.1 */}
            <div className="p-4 border rounded-lg bg-secondary/10">
                <div className="flex items-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <h3 className="font-bold">Ex 2.1: Performance</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Implemented Virtualization (TanStack Virtual) & React.memo for 5000+ rows.</p>
                <Link to="/dashboard/inventory"><Button variant="outline" size="sm" className="w-full">View Laggy List Fix</Button></Link>
            </div>

             {/* Ex 3.2 */}
             <div className="p-4 border rounded-lg bg-secondary/10">
                <div className="flex items-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <h3 className="font-bold">Ex 3.2: Portals</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Implemented Modal component using createPortal for "Delete Confirmation".</p>
                <Button variant="outline" size="sm" className="w-full" disabled>See inside Inventory</Button>
            </div>
        </div>
      </section>
    </div>
  );
};

export default LabExercisesPage;