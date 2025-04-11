import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { TicketForm } from '@/components/tickets/TicketForm';
import { PageHeader } from '@/components/PageHeader';
import { createTicket } from '@/lib/utils';

const CreateTicketPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    
    try {
      // Call the API to create the ticket
      const newTicket = await createTicket(formData);
      
      // Show success toast
      toast.success('Ticket created successfully', {
        description: `Ticket #${newTicket.id} has been created.`,
      });
      
      // Redirect to the ticket list page
      navigate('/tickets');
    } catch (error) {
      // Show error toast
      toast.error('Failed to create ticket', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Ticket"
        description="Submit a new support request"
      />
      <TicketForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};

export default CreateTicketPage;
