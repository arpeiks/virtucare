"use client";

export function AppointmentsPage() {
  return (
    <div className="p-10">
      <div className="max-w-4xl">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Your Appointments</h1>
        <p className="text-muted-foreground mb-8">
          View and manage your upcoming and past appointments.
        </p>
        
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <p className="text-muted-foreground">
            Appointments list will be implemented here
          </p>
        </div>
      </div>
    </div>
  );
}