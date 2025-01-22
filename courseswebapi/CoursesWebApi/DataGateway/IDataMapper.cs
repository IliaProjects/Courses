namespace CoursesWebApi.DataGateway
{
    public interface IDataMapper<T>
    {
        public IQueryable<T> GetAll();
        public T Get(int id);
        public Task<bool> InsertAsync(T item);
        public Task<bool> UpdateAsync(object item);
        public Task<bool> DeleteAsync(int id);
    }
}
