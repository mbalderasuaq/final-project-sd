using Microsoft.EntityFrameworkCore;
using SoapApi.Exceptions;
using SoapApi.Infrastructure;
using SoapApi.Mappers;

namespace SoapApi.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly RelationalDbContext _dbContext;

    public TaskRepository(RelationalDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<TaskModel?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var task = await _dbContext.Tasks.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (task is null) return null;
        return task.ToModel();
    }

    public async Task<IList<TaskModel>> GetAllAsync(CancellationToken cancellationToken)
    {
        var tasks = await _dbContext.Tasks.AsNoTracking().Select(x => x.ToModel()).ToListAsync(cancellationToken);
        return tasks;
    }

    public async Task<IList<TaskModel>> GetAllByTitleAsync(string title, CancellationToken cancellationToken)
    {
        var tasks = await _dbContext.Tasks.AsNoTracking().Where(x => x.Title.Contains(title)).Select(x => x.ToModel()).ToListAsync(cancellationToken);
        return tasks;
    }

    public async Task DeleteByIdAsync(TaskModel task, CancellationToken cancellationToken)
    {
        var taskEntity = task.ToEntity();
        _dbContext.Tasks.Remove(taskEntity);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<TaskModel> CreateAsync(TaskModel task, CancellationToken cancellationToken)
    {
        task.Id = Guid.NewGuid();
        await _dbContext.AddAsync(task.ToEntity(), cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return task;
    }

    public async Task UpdateAsync(TaskModel task, CancellationToken cancellationToken)
    {
        var currentTask = await _dbContext.Tasks.FirstOrDefaultAsync(x => x.Id == task.Id, cancellationToken) ?? throw new TaskNotFoundException();
        
        currentTask.Title = task.Title;
        currentTask.Description = task.Description;
        currentTask.DueDate = task.DueDate;
        currentTask.IsCompleted = task.IsCompleted;

        await _dbContext.SaveChangesAsync(cancellationToken);

    }
}