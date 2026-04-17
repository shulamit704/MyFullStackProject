using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;


namespace server
{
    public class Program
    {
        public static void Main(string[] args)
        {
           

            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers().AddNewtonsoftJson();


            builder.Services.AddScoped<ProcedureService>();

            builder.Services.AddControllers(opt =>

            {

                // remove formatter that turns nulls into 204 - No Content responses

                // this formatter breaks Angular's Http response JSON parsing

                opt.OutputFormatters.RemoveType<HttpNoContentOutputFormatter>();

            });


            builder.Services.AddSwaggerGen(c =>

            {

                c.SwaggerDoc("v1", new OpenApiInfo { Title = "ApiDbService", Version = "v1" });

            });

            


            var app = builder.Build();



            app.UseForwardedHeaders();



            //app.UseDeveloperExceptionPage();



            app.UseSwagger();

            app.UseSwaggerUI(c => c.SwaggerEndpoint("./v1/swagger.json", "apiDbService v1"));



            app.UseCors(builder =>

            {

                builder

                    .SetIsOriginAllowed(origin =>

                    {

                        string sHost = new Uri(origin).Host.ToLower();



                        return sHost == "localhost"

                            || sHost.IndexOf("pc110-") > -1

                            || sHost == "bloewcftest"

                            || sHost == "bloewcf"

                            || sHost.IndexOf("ita-") > -1;

                    })

                    .WithOrigins("https://blotestnew.taxes.gov.il" /*, "https://blonew.taxes.gov.il"*/

                                )

                    .AllowAnyHeader()

                    .AllowAnyMethod();

            });



            app.UseHttpsRedirection();



            app.UseRouting();



            app.UseCertificateForwarding();

            app.UseAuthorization();

            app.UseAuthentication();



            app.MapControllers();



            app.Run();
        }
    }
}