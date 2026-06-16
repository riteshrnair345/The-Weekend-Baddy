import Footer from '@/components/Footer';

export const metadata = {
  title: 'Cancellation & Refund Policy | The Weekend Baddy',
};

export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800 flex flex-col">
      <div className="max-w-4xl mx-auto px-4 py-20 flex-grow">
        <h1 className="text-4xl font-black mb-8 text-slate-800">Cancellation & Refund Policy</h1>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <p className="font-medium text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-slate-800 mt-8">1. General Policy</h2>
          <p>
            Due to the limited availability of courts and the required matchmaking process, all bookings are generally final. 
            However, we understand that plans can change, and we offer refunds under the following conditions.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8">2. Cancellation Window</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>More than 24 hours before the session:</strong> If you cancel your booking more than 24 hours before the scheduled start time, you are eligible for a full refund or a free reschedule.</li>
            <li><strong>Less than 24 hours before the session:</strong> Cancellations made within 24 hours of the start time are <strong>non-refundable</strong>.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800 mt-8">3. No-Show Policy</h2>
          <p>
            If you book a slot and fail to attend the session without prior notice (a "no-show"), no refunds or rescheduling will be provided.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8">4. Event Cancellation by Organizers</h2>
          <p>
            In the rare event that The Weekend Baddy cancels a session (due to venue unavailability, emergencies, etc.), all registered players will receive a <strong>100% full refund</strong> automatically credited to their original payment method.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8">5. Refund Processing</h2>
          <p>
            Approved refunds will be processed within 5-7 business days back to the original payment method used via our payment gateway.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
