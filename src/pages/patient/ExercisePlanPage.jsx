import PageContainer from '@/components/layout/PageContainer'
import ExercisePlanViewer from '@/components/exercises/ExercisePlanViewer'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import useExercisePlan from '@/hooks/useExercisePlan'
import { useAuthStore } from '@/stores/authStore'
import { formatDate } from '@/utils/formatDate'

export default function ExercisePlanPage() {
  const user = useAuthStore((s) => s.user)
  const { plans, isLoading } = useExercisePlan({ patientId: user?.id })

  return (
    <PageContainer title="My Exercise Plans">
      {isLoading ? (
        <Spinner size="lg" />
      ) : plans?.length > 0 ? (
        <div className="space-y-6">
          {plans.map((plan) => (
            <Card key={plan.id}>
              <p className="mb-3 text-sm text-muted-foreground">
                Created {formatDate(plan.created_at)}
              </p>
              <ExercisePlanViewer plan={plan} />
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          No exercise plans assigned yet. Your PT will create one after your session.
        </p>
      )}
    </PageContainer>
  )
}
