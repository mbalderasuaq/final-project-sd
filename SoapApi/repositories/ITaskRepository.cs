namespace SoapApi.Repositories;

public interface ITaskRepository
{
    public Task<TaskModel?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    public Task<IList<TaskModel>> GetAllAsync(CancellationToken cancellationToken);

    public Task<IList<TaskModel>> GetAllByTitleAsync(string title, CancellationToken cancellationToken);

    public Task DeleteByIdAsync(TaskModel task, CancellationToken cancellationToken);

    public Task<TaskModel> CreateAsync(TaskModel task, CancellationToken cancellationToken);

    public Task UpdateAsync(TaskModel task, CancellationToken cancellationToken);
}