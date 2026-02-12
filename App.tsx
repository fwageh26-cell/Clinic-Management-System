import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Column } from './components/Column';
import { Patient, PatientStatus } from './components/PatientCard';
import { Toaster, toast } from 'sonner';
import { LayoutGroup } from 'motion/react';

const MOCK_PATIENTS: Patient[] = [
  { id: '1', name: 'Sarah Johnson', nationalId: '987654321', status: 'waiting', arrivalTime: '09:15 AM' },
  { id: '2', name: 'Michael Chen', nationalId: '123456789', status: 'with-doctor', arrivalTime: '08:45 AM' },
  { id: '3', name: 'Emma Wilson', nationalId: '555666777', status: 'finished', arrivalTime: '08:00 AM' },
];

const App: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);

  const handleAddPatient = useCallback((data: { name: string; nationalId: string }) => {
    const newPatient: Patient = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      nationalId: data.nationalId,
      status: 'waiting',
      arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setPatients(prev => [newPatient, ...prev]);
  }, []);

  const handleMovePatient = useCallback((id: string, nextStatus: PatientStatus) => {
    setPatients(prev => prev.map(p => 
      p.id === id ? { ...p, status: nextStatus } : p
    ));
    toast.success(`Patient moved to ${nextStatus.replace('-', ' ')}`);
  }, []);

  const handleDeletePatient = useCallback((id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    toast.error('Patient removed from list');
  }, []);

  const waitingPatients = patients.filter(p => p.status === 'waiting');
  const withDoctorPatients = patients.filter(p => p.status === 'with-doctor');
  const finishedPatients = patients.filter(p => p.status === 'finished');

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Toaster position="top-right" richColors />
      
      <Sidebar onAddPatient={handleAddPatient} />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Visit Management</h2>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Dashboard
            </div>
            <div className="px-3 py-1 bg-slate-100 rounded-full">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-x-auto p-8">
          <LayoutGroup>
            <div className="flex gap-6 h-full min-w-max">
              <Column
                title="Waiting"
                status="waiting"
                patients={waitingPatients}
                onMove={handleMovePatient}
                onDelete={handleDeletePatient}
                color="green"
              />
              <Column
                title="With Doctor"
                status="with-doctor"
                patients={withDoctorPatients}
                onMove={handleMovePatient}
                onDelete={handleDeletePatient}
                color="yellow"
              />
              <Column
                title="Finished"
                status="finished"
                patients={finishedPatients}
                onMove={handleMovePatient}
                onDelete={handleDeletePatient}
                color="gray"
              />
            </div>
          </LayoutGroup>
        </div>
      </main>
    </div>
  );
};

export default App;
