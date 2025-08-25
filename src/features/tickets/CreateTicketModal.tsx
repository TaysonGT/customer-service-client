import { Button, Input } from '../../components/ui'
import Loader from '../../components/Loader'
import { ErrorInfo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileUploadWithPreview } from '../../components/ui';
import { createAxiosAuthInstance } from '../../services/axiosAuth';
import toast from 'react-hot-toast';

// Define validation schema
const ticketSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  subject: z.string().min(1, 'Subject is required').max(100, 'Subject is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  attachments: z.any().optional()
});

type TicketFormData = z.infer<typeof ticketSchema>;

const CreateTicketModal = ({onAction, setShow}:{onAction:()=>void, setShow: (s:boolean)=>void}) => {
    const [isLoading, setIsLoading] = useState(false);
    const api = createAxiosAuthInstance()
    const { register, handleSubmit, formState: { errors }, setError } = useForm<TicketFormData>({
      resolver: zodResolver(ticketSchema),
      defaultValues: {
        priority: 'medium'
      }
    });
    
    const handleCreateTicket = async (data: TicketFormData) => {
      setIsLoading(true);
      
      try {
        const {data:response} = await api.post('/tickets', data)
        
        if(!response.success) throw new Error(response.message)
        
        console.log('Ticket data:', response);
        toast.success(response.message)

        setShow(false);
        onAction();
        
      } catch (error:any) {
        setError('root', { message: error.message ||'Failed to create ticket. Please try again.' });
      }finally{
        setIsLoading(false);
      }
    };
    
    return (
      <form onSubmit={handleSubmit(handleCreateTicket)} className="space-y-4 max-w-80">
        {errors.root && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {errors.root.message}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select 
            {...register('category')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a category</option>
            <option value="technical">Technical Issue</option>
            <option value="billing">Billing Question</option>
            <option value="account">Account Management</option>
            <option value="feature">Feature Request</option>
            <option value="other">Other</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <Input 
              {...register('subject')}
              placeholder="Briefly describe your issue"
            />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            {...register('description')}
            rows={4} 
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Please provide as much detail as possible about your issue..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input 
                type="radio" 
                value="low" 
                {...register('priority')}
                className="text-blue-600 focus:ring-blue-500" 
              />
              <span className="ml-2">Low</span>
            </label>
            <label className="inline-flex items-center">
              <input 
                type="radio" 
                value="medium" 
                {...register('priority')}
                className="text-blue-600 focus:ring-blue-500" 
              />
              <span className="ml-2">Medium</span>
            </label>
            <label className="inline-flex items-center">
              <input 
                type="radio" 
                value="high" 
                {...register('priority')}
                className="text-blue-600 focus:ring-blue-500" 
              />
              <span className="ml-2">High</span>
            </label>
            <label className="inline-flex items-center">
              <input 
                type="radio" 
                value="urgent" 
                {...register('priority')}
                className="text-blue-600 focus:ring-blue-500" 
              />
              <span className="ml-2">Urgent</span>
            </label>
          </div>
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
          )}
        </div>

        <FileUploadWithPreview 
          name="attachments"
          maxFiles={5}
          maxSize={10}
          acceptedTypes="image/*,.pdf,.doc,.docx"
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={() => setShow(false)} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader size={16} className="mr-2" />
                Creating...
              </>
            ) : (
              'Create Ticket'
            )}
          </Button>
        </div>
      </form>
  )
}

export default CreateTicketModal