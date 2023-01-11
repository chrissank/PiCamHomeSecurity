using DataAccessLayer.Models;
using Microsoft.AspNetCore.Identity;

namespace Website
{
    public class SeedDatabase
    {

        public async Task Seed(IServiceProvider serviceProvider, IConfiguration Configuration)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<AppUser>>();

            await SeedRoles(roleManager);

            await SeedUsers(Configuration.GetValue(typeof(string), "AdminUsername").ToString(), Configuration.GetValue(typeof(string), "AdminPassword").ToString(), userManager);
        }

        public async Task SeedRoles(RoleManager<IdentityRole> roleManager)
        {
            string[] roleNames = { "Admin", "User" };
            IdentityResult roleResult;

            foreach (var roleName in roleNames)
            {
                var roleExist = await roleManager.RoleExistsAsync(roleName);
                if (!roleExist)
                {
                    //create the roles and seed them to the database
                    roleResult = await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }
        }

        public async Task SeedUsers(string adminUsername, string adminPassword, UserManager<AppUser> userManager)
        {
            var poweruser = new AppUser
            {
                UserName = adminUsername,
                DisplayName = adminUsername
            };

            var _user = await userManager.FindByNameAsync(adminUsername);

            if (_user == null)
            {
                var createPowerUser = await userManager.CreateAsync(poweruser, adminPassword);
                if (createPowerUser.Succeeded)
                {
                    await userManager.AddToRoleAsync(poweruser, "Admin");
                }
            }
        }

    }
}
