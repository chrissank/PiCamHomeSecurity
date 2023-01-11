using DataAccessLayer.Data;
using DataAccessLayer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Services
{
    public class AppUserService
    {
        private readonly IDbContextFactory<ApplicationDbContext> _contextFactory;
        private readonly UserManager<AppUser> _userManager;

        public AppUserService(IDbContextFactory<ApplicationDbContext> contextFactory, UserManager<AppUser> userManager)
        {
            _contextFactory = contextFactory;
            _userManager = userManager;
        }

        [Authorize(Roles = "Admin")]
        public async Task<AppUser> CreateAppUser(AppUser appUser, string password)
        {
            var _user = await _userManager.FindByNameAsync(appUser.UserName);

            if (_user == null)
            {
                var createPowerUser = await _userManager.CreateAsync(appUser, password);
                if (createPowerUser.Succeeded)
                {
                    await _userManager.AddToRoleAsync(appUser, "User");
                }
            }
            return appUser;
        }

        [Authorize]
        public async Task<List<AppUser>> GetAppUsers(bool withDeleted)
        {
            using var context = _contextFactory.CreateDbContext();
            return await context.Users.Where(op => !op.IsDeleted || withDeleted).ToListAsync();
        }
    }
}
