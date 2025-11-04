'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { FaPlus, FaSpinner, FaEnvelope, FaTimes, FaTrash, FaPaperPlane, FaUsers } from 'react-icons/fa';
import {
  useGetNewslettersQuery,
  useCreateNewsletterMutation,
  useSendNewsletterMutation,
  useGetSubscribersQuery,
  useDeleteNewsletterMutation,
} from '@/redux/api/Newsletter';

export default function NewsletterPage() {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    content: ''
  });

  // RTK Query hooks
  const { data: newslettersData, isLoading, refetch } = useGetNewslettersQuery({});
  const { data: subscribersData, refetch: refetchSubscribers } = useGetSubscribersQuery({ status: 'active' });
  const [createNewsletter, { isLoading: isCreating }] = useCreateNewsletterMutation();
  const [sendNewsletter, { isLoading: isSending }] = useSendNewsletterMutation();
  const [deleteNewsletter, { isLoading: isDeleting }] = useDeleteNewsletterMutation();

  const newsletters = newslettersData?.data?.newsletters || [];
  const subscribers = subscribersData?.data?.subscribers || [];
  const [showSubscribersModal, setShowSubscribersModal] = useState(false);
  const [sendingNewsletterId, setSendingNewsletterId] = useState(null);
  const [deletingNewsletterId, setDeletingNewsletterId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateNewsletter = async () => {
    if (!formData.title || !formData.subject || !formData.content) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fill in all fields',
        icon: 'error'
      });
      return;
    }

    try {
      const result = await createNewsletter(formData).unwrap();

      if (result.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Newsletter created successfully',
          icon: 'success'
        });
        setShowCreateModal(false);
        setFormData({ title: '', subject: '', content: '' });
        refetch();
      }
    } catch (error) {
      console.error('Create newsletter error:', error);
      Swal.fire({
        title: 'Error!',
        text: error?.data?.message || error?.message || 'Failed to create newsletter',
        icon: 'error'
      });
    }
  };

  const handleSendNewsletter = async (newsletterId) => {
    const recipientCount = subscribers.length;

    const result = await Swal.fire({
      title: 'Send Newsletter?',
      html: `This will send the newsletter to <b>${recipientCount}</b> active subscribers. Are you sure?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, send it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    setSendingNewsletterId(newsletterId);

    try {
      const result = await sendNewsletter({ newsletterId }).unwrap();

      if (result.success) {
        Swal.fire({
          title: 'Sent!',
          html: `Newsletter sent successfully to <b>${result.data.sentCount}</b> subscribers!`,
          icon: 'success'
        });
        refetch();
      }
    } catch (error) {
      console.error('Send newsletter error:', error);
      Swal.fire({
        title: 'Error!',
        text: error?.data?.message || error?.message || 'Failed to send newsletter',
        icon: 'error'
      });
    } finally {
      setSendingNewsletterId(null);
    }
  };

  const handleDeleteNewsletter = async (newsletterId, newsletterSubject) => {
    const result = await Swal.fire({
      title: 'Delete Newsletter?',
      html: `Are you sure you want to delete <strong>"${newsletterSubject}"</strong>?<br><br>This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    setDeletingNewsletterId(newsletterId);

    try {
      const result = await deleteNewsletter(newsletterId).unwrap();

      if (result.success) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Newsletter has been deleted successfully.',
          icon: 'success'
        });
        refetch();
      }
    } catch (error) {
      console.error('Delete newsletter error:', error);
      Swal.fire({
        title: 'Error!',
        text: error?.data?.message || error?.message || 'Failed to delete newsletter',
        icon: 'error'
      });
    } finally {
      setDeletingNewsletterId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Newsletter Management</h1>
          <p className="text-mutedForeground">Create and send newsletters to subscribers</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          <FaPlus /> Create Newsletter
        </button>
      </div>

      {/* Newsletters List */}
      <div className="bg-cardBackground rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Recipients</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Sent At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {newsletters.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-mutedForeground">
                    No newsletters found. Create your first newsletter!
                  </td>
                </tr>
              ) : (
                newsletters.map((newsletter) => (
                  <tr key={newsletter._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium">{newsletter.subject}</div>
                      <div className="text-sm text-mutedForeground">{newsletter.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${newsletter.status === 'sent'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {newsletter.status === 'sent' ? 'Sent' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          refetchSubscribers();
                          setShowSubscribersModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                      >
                        <FaUsers className="text-sm" />
                        {subscribers.length} {subscribers.length === 1 ? 'subscriber' : 'subscribers'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-mutedForeground">
                      {formatDate(newsletter.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-mutedForeground">
                      {newsletter.sentAt ? formatDate(newsletter.sentAt) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSendNewsletter(newsletter._id)}
                          disabled={isSending}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          title={newsletter.status === 'sent' ? 'Resend Newsletter' : 'Send Newsletter'}
                        >
                          {sendingNewsletterId === newsletter._id ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                        </button>
                        <button
                          onClick={() => handleDeleteNewsletter(newsletter._id, newsletter.subject)}
                          disabled={isDeleting}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Newsletter"
                        >
                          {deletingNewsletterId === newsletter._id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Newsletter Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 -top-10 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Create Newsletter</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ title: '', subject: '', content: '' });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Newsletter Title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Newsletter Subject Line"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={12}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Write your newsletter content here... (HTML supported)"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can use HTML tags for formatting. Line breaks will be preserved.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCreateNewsletter}
                    disabled={isCreating}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? 'Creating...' : 'Create Newsletter'}
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setFormData({ title: '', subject: '', content: '' });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscribers Modal */}
      {showSubscribersModal && (
        <div className="fixed inset-0 -top-10 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Newsletter Subscribers</h2>
                <button
                  onClick={() => setShowSubscribersModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Total Active Subscribers:</strong> {subscribers.length}
                  </p>
                </div>

                {subscribers.length === 0 ? (
                  <div className="text-center py-8">
                    <FaEnvelope className="mx-auto text-gray-400 text-4xl mb-4" />
                    <p className="text-gray-500">No active subscribers found</p>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">#</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Subscribed At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {subscribers.map((subscriber, index) => (
                          <tr key={subscriber._id || index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 break-all">
                              {subscriber.email}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {subscriber.subscribedAt
                                ? formatDate(subscriber.subscribedAt)
                                : formatDate(subscriber.createdAt)
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setShowSubscribersModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

