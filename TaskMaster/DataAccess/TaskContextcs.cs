using Microsoft.EntityFrameworkCore;
using TaskMaster.Models;

namespace TaskMaster.DataAccess
{
    public class TaskContext : DbContext
    {
        public TaskContext(DbContextOptions<TaskContext> options) : base(options) { }
        public DbSet<TaskItem> TaskItems { get; set; }
    }
}
