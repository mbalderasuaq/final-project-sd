using System.ServiceModel;
using SoapApi.Dtos;

namespace SoapApi.Contracts;

[ServiceContract]
public interface ITaskContract
{
    [OperationContract]
    public Task<IList<TaskResponseDto>> GetAll(CancellationToken cancellationToken);

    [OperationContract]
    public Task<IList<TaskResponseDto>> GetAllByTitle(string title, CancellationToken cancellationToken);

    [OperationContract]
    public Task<TaskResponseDto?> GetById(Guid id, CancellationToken cancellationToken);

    [OperationContract]
    public Task<TaskResponseDto> Create(TaskRequestDto taskRequestDto, CancellationToken cancellationToken);

    [OperationContract]
    public Task Update(TaskRequestDto taskRequestDto, CancellationToken cancellationToken);

    [OperationContract]
    public Task DeleteById(Guid id, CancellationToken cancellationToken);
}