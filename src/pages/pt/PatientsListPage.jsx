import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, Search } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import PatientCard from '@/components/patients/PatientCard'
import usePatients from '@/hooks/usePatients'
import { useAuthStore } from '@/stores/authStore'

export default function PatientsListPage() {
  const role = useAuthStore((s) => s.role)
  const base = role === 'admin' ? '/admin' : '/pt'
  const { patients, isLoading, searchPatients } = usePatients()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)

  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (query.trim().length > 1) {
      const results = await searchPatients(query.trim())
      setSearchResults(results)
    } else {
      setSearchResults(null)
    }
  }

  const displayPatients = searchResults !== null ? searchResults : patients

  return (
    <PageContainer title="Patients">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-white pl-10 pr-4 py-2.5 text-sm font-sans shadow-sm transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Link to={`${base}/patients/new`}>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Patient
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : displayPatients?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onClick={() => navigate(`${base}/patients/${patient.id}`)}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-muted-foreground font-sans mb-4">
            {searchQuery ? 'No patients found matching your search.' : 'No patients yet.'}
          </p>
          {!searchQuery && (
            <Link to={`${base}/patients/new`}>
              <Button variant="outline" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add Your First Patient
              </Button>
            </Link>
          )}
        </Card>
      )}
    </PageContainer>
  )
}
