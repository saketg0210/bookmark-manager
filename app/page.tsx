import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import BookmarkManager from '@/components/BookmarkManager'
import { createServerClient } from '@supabase/ssr'

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }
  

  // Initial fetch (Server Side)
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl text-black font-bold">My Bookmarks</h1>
          <form action="/login" method="post">
            <button className="text-gray-500 hover:text-black text-sm">Sign Out</button>
          </form>
        </div>
        
        <BookmarkManager initialBookmarks={bookmarks ?? []} userId={user.id} />
      </div>
    </main>
  )
}