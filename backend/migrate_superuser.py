"""
Migration script to add superuser column to existing database
This script safely adds the is_superuser column without losing data
"""
import sqlite3
from pathlib import Path

def migrate_database():
    db_path = Path(__file__).parent / "treasury.db"
    
    if not db_path.exists():
        print("❌ Database not found. Please run the application first to create it.")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if is_superuser column already exists
        cursor.execute("PRAGMA table_info(admins)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'is_superuser' in columns:
            print("✅ is_superuser column already exists!")
            
            # Make sure the default admin is a superuser
            cursor.execute("""
                UPDATE admins 
                SET is_superuser = 1 
                WHERE username = 'admin'
            """)
            conn.commit()
            print("✅ Made 'admin' user a superuser")
        else:
            print("📝 Adding is_superuser column to admins table...")
            
            # Add the is_superuser column with default value False
            cursor.execute("""
                ALTER TABLE admins 
                ADD COLUMN is_superuser BOOLEAN NOT NULL DEFAULT 0
            """)
            
            # Make the default admin a superuser
            cursor.execute("""
                UPDATE admins 
                SET is_superuser = 1 
                WHERE username = 'admin'
            """)
            
            conn.commit()
            print("✅ Successfully added is_superuser column!")
            print("✅ Made 'admin' user a superuser")
        
        # Show all admins with their superuser status
        cursor.execute("SELECT id, username, is_superuser FROM admins")
        admins = cursor.fetchall()
        
        print("\n📋 Current Admin Users:")
        print("-" * 50)
        for admin in admins:
            role = "SUPERUSER" if admin[2] else "Admin"
            print(f"  ID: {admin[0]} | Username: {admin[1]} | Role: {role}")
        print("-" * 50)
        
    except Exception as e:
        print(f"❌ Error during migration: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    print("🔄 Starting database migration...")
    print("=" * 50)
    migrate_database()
    print("=" * 50)
    print("✅ Migration complete!")
