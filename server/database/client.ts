import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const config = useRuntimeConfig()

// Create PostgreSQL connection pool
const pool = new Pool({
    connectionString: config.databaseUrl,
})

// Create Drizzle ORM instance
export const db = drizzle(pool, { schema })

// Export pool for raw queries if needed
export { pool }
