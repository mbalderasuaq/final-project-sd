using System.ServiceModel;
using SoapApi.Contracts;
using SoapApi.Dtos;
using SoapApi.Mappers;
using SoapApi.Repositories;

namespace SoapApi.Services;

public class TaskService: ITaskContract
{
    private readonly ITaskRepository _taskRepository;

    public TaskService(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task<TaskResponseDto?> GetById(Guid id, CancellationToken cancellationToken)
    {
        var task = await _taskRepository.GetByIdAsync(id, cancellationToken);

        if (task == null)
        {
            return null;
        }

        return task.ToDto();
    }

    public async Task<IList<TaskResponseDto>> GetAll(CancellationToken cancellationToken)
    {
        var tasks = await _taskRepository.GetAllAsync(cancellationToken);
        return tasks.Select(task => task.ToDto()).ToList();
    }

    public async Task<IList<TaskResponseDto>> GetAllByTitle(string title, CancellationToken cancellationToken)
    {
        var tasks = await _taskRepository.GetAllByTitleAsync(title, cancellationToken);
        return tasks.Select(task => task.ToDto()).ToList();
    }

    public async Task<TaskResponseDto> Create(TaskRequestDto task, CancellationToken cancellationToken)
    {
        var newTask = task.ToModel();

        var createdTask = await _taskRepository.CreateAsync(newTask, cancellationToken);

        return createdTask.ToDto();
    }

    public async Task Update(TaskRequestDto task, CancellationToken cancellationToken)
    {
        var updatedTask = task.ToModel();

        await _taskRepository.UpdateAsync(updatedTask, cancellationToken);
    }

    public async Task DeleteById(Guid id, CancellationToken cancellationToken)
    {
        var task = await _taskRepository.GetByIdAsync(id, cancellationToken);

        if (task == null)
        {
            throw new FaultException("Task not found");
        }

        await _taskRepository.DeleteByIdAsync(task, cancellationToken);
    }
}