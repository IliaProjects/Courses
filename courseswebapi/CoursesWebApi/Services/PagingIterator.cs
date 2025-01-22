using CoursesWebApi.Models;
using CoursesWebApi.Models.Entity;
using CoursesWebApi.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace CoursesWebApi.Services
{
    public class PagingIterator<T>
    {
        private IQueryable<T> _q;
        private int _pageNr;
        private int _pageSize;
        public PagingIterator(IQueryable<T> q, int pageNr = 1, int pageSize = 10)
        {
            _q = q;
            _pageNr = pageNr;
            _pageSize = pageSize;
        }
        [MethodImpl(MethodImplOptions.Synchronized)]
        public IQueryable<T> getGroup()
        {
            int recSkip = (_pageNr - 1) * _pageSize;
            var skippedList = _q.Skip(recSkip);

            List<T> rec = new List<T>();

            for (int i = 0; i < _pageSize; i++)
            {
                if(i < skippedList.Count()) rec.Add(skippedList.ToList()[i]);
            }

            /*var rec = _q.Skip(recSkip).Take(_pageSize);

            if (typeof(T) == typeof(User))
            {
                Console.WriteLine("-----------");
                Console.WriteLine();
                Console.WriteLine("Total length: " + rec.Count());
                Console.WriteLine();
                int i = 0;
                foreach (var item in _q)
                {
                    Console.WriteLine("Q" + i++ + ": " + ((User)Convert.ChangeType(item, typeof(User))).Email);
                }

                var skip = _q.Skip(recSkip);

                Console.WriteLine();
                Console.WriteLine("Total after skip: " + skip.Count());
                Console.WriteLine();
                i = 0;
                foreach (var item in skip)
                {
                    Console.WriteLine("Skip" + i++ + ": " + ((User)Convert.ChangeType(item, typeof(User))).Email);
                }

                List<T> recs = new List<T>();

                for (i = 0; i < _pageSize; i++)
                {
                    recs.Add(skip.ToList()[i]);
                }

                Console.WriteLine();
                Console.WriteLine();
                Console.WriteLine("PageNr: " + _pageNr);
                Console.WriteLine("Rec length: " + rec.Count());
                Console.WriteLine();
                i = 0;
                foreach (var item in recs)
                {
                    Console.WriteLine("Rec" + i++ + ": " + ((User)Convert.ChangeType(item, typeof(User))).Email);
                }
            }*/
            return rec.AsQueryable();
        }

        public PagerViewModel getPager()
        {
            return new PagerViewModel(_q.Count(), _pageNr, _pageSize);
        }
    }
}
