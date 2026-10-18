import { Link } from 'react-router-dom'
import { CheckCircle2, TrendingUp, Sparkles, Shield, ArrowRight, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-text overflow-hidden relative">
      {/* Background Gradient Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">D</div>
          <span className="font-bold text-xl tracking-tight">Personal Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost">ចូលប្រើ (Login)</Button>
          </Link>
          <Link to="/login">
            <Button>ចាប់ផ្តើមឥឡូវនេះ</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-32 text-center animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
          <Sparkles className="h-4 w-4" /> បង្កើតឡើងជាមួយ AI និង Database ពិតប្រាកដ
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          គ្រប់គ្រងជីវិតរបស់អ្នក <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-glow">
            ក្នុងកន្លែងតែមួយ
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10">
          តាមដានទម្លាប់ប្រចាំថ្ងៃ គ្រប់គ្រងការចំណាយ និងកត់ត្រាអារម្មណ៍របស់អ្នក ជាមួយនឹងការវិភាគពី AI ដ៏ឆ្លាតវៃ។
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link to="/login">
            <Button size="lg" className="h-14 px-8 text-lg">
              ចាប់ផ្តើមប្រើប្រាស់ <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-32 text-left">
          <div className="card bg-surface border-border hover:border-primary/50 transition-colors">
            <CheckCircle2 className="h-10 w-10 text-success mb-4" />
            <h3 className="text-lg font-bold mb-2">តាមដានទម្លាប់</h3>
            <p className="text-sm text-text-secondary">មើលឃើញភាពជោគជ័យរបស់អ្នកតាមរយៈ Heatmap និងការរាប់ថ្ងៃជាប់គ្នា (Streaks)។</p>
          </div>

          <div className="card bg-surface border-border hover:border-primary/50 transition-colors">
            <Wallet className="h-10 w-10 text-danger mb-4" />
            <h3 className="text-lg font-bold mb-2">គ្រប់គ្រងការចំណាយ</h3>
            <p className="text-sm text-text-secondary">កត់ត្រាការចំណាយ កំណត់ថវិកា និងមើលក្រាហ្វស្ថិតិយ៉ាងច្បាស់លាស់។</p>
          </div>

          <div className="card bg-surface border-border hover:border-primary/50 transition-colors">
            <TrendingUp className="h-10 w-10 text-warning mb-4" />
            <h3 className="text-lg font-bold mb-2">តាមដានអារម្មណ៍</h3>
            <p className="text-sm text-text-secondary">កត់ត្រាអារម្មណ៍ប្រចាំថ្ងៃ ដើម្បីដឹងពីសុខភាពផ្លូវចិត្តរបស់អ្នក។</p>
          </div>

          <div className="card bg-surface border-border hover:border-primary/50 transition-colors">
            <Sparkles className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-lg font-bold mb-2">AI វិភាគ</h3>
            <p className="text-sm text-text-secondary">ទទួលបានដំបូន្មានហិរញ្ញវត្ថុផ្ទាល់ខ្លួនពី AI ដើម្បីចំណាយឱ្យឆ្លាតវៃ។</p>
          </div>
        </div>
      </main>
    </div>
  )
}