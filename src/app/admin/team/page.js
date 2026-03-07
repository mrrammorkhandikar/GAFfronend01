'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import AdminLayout from '../components/AdminLayout.js'
import DataTable from '../components/DataTable.js'
import AdminApiService from '../services/admin-api.js'

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const result = await AdminApiService.getTeamMembers({ page: 1, limit: 100 })
      if (result.success) {
        setTeamMembers(result.data)
      }
    } catch (error) {
      console.error('Error fetching team members:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = (action, member) => {
    switch (action) {
      case 'view':
        router.push(`/admin/team/${member.id}`)
        break
      case 'edit':
        router.push(`/admin/team/edit/${member.id}`)
        break
      case 'delete':
        handleDelete(member)
        break
    }
  }

  const handleDelete = async (member) => {
    if (window.confirm(`Are you sure you want to delete "${member.name}"?`)) {
      try {
        const result = await AdminApiService.deleteTeamMember(member.id)
        if (result.success) {
          fetchTeamMembers()
        } else {
          alert('Failed to delete team member: ' + result.message)
        }
      } catch (error) {
        console.error('Error deleting team member:', error)
        alert('An error occurred while deleting the team member')
      }
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value, item) => (
        <div className="flex items-center">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={value}
              width={40}
              height={40}
              className="rounded-full object-cover mr-3"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
              <span className="text-gray-600 font-medium">
                {value.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-gray-500 text-sm">{item.position}</div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => value || 'N/A'
    },
    {
      key: 'bio',
      label: 'Bio',
      render: (value) => (
        <div className="max-w-xs truncate text-gray-500">
          {value || 'No bio provided'}
        </div>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ]

  const actions = [
    { key: 'view', label: 'View', type: 'view' },
    { key: 'edit', label: 'Edit', type: 'edit' },
    { key: 'delete', label: 'Delete', type: 'delete' }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your organization&apos;s team members
            </p>
          </div>
        </div>

        <DataTable
          title="All Team Members"
          data={teamMembers}
          columns={columns}
          actions={actions}
          onAction={handleAction}
          onCreate={() => router.push('/admin/team/create')}
          loading={loading}
          searchable={true}
          filterable={true}
          filters={[
            {
              key: 'isActive',
              label: 'Status',
              options: [
                { value: '', label: 'All Status' },
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' }
              ]
            }
          ]}
        />
      </div>
    </AdminLayout>
  )
}