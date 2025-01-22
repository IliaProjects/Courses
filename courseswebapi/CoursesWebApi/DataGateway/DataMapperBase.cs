using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace CoursesWebApi.DataGateway
{
    public abstract class DataMapperBase
    {
        protected AppDbContext _dbContext;

        public DataMapperBase(AppDbContext appDbContext)
        {
            _dbContext = appDbContext;
        }

        [MethodImpl(MethodImplOptions.Synchronized)]
        protected bool TryToSaveDataChanges()
        {
            try
            {
                _dbContext.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message + ex.StackTrace);
                return false;
            }
        }

        protected async Task<bool> TryToSaveDataChangesAsync()
        {
            try
            {
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                _dbContext.UndoingChangesDbContextLevel();
                return false;
            }
        }
    }
}
