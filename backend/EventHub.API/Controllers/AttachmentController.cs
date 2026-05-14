using EventHub.BLL.Mapping;
using EventHub.BLL.Services.Interfaces;
using EventHub.API.Security;
using EventHub.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventHub.API.Controllers
{
    [Route("api/attachment")]
    [ApiController]
    public class AttachmentController : ControllerBase
    {
        private readonly IAttachmentService _attachmentService;
        private readonly IEventService _eventService;
        private readonly IUserService _userService;

        public AttachmentController(IAttachmentService attachmentService, IEventService eventService, IUserService userService)
        {
            _attachmentService = attachmentService;
            _eventService = eventService;
            _userService = userService;
        }

        private async Task<bool> HasApprovedOrganizerAccessAsync(string userId)
        {
            var currentUser = await _userService.GetUserByIdAsync(userId);
            return currentUser != null && currentUser.ApplyAs == UserRole.EventOrganizer && currentUser.Status == AccountStatus.Approved;
        }

        [HttpPost("upload")]
        [Authorize(Roles = $"{nameof(UserRole.Admin)},{nameof(UserRole.EventOrganizer)}")]
        [RequestSizeLimit(52_428_800)]
        public async Task<IActionResult> Upload([FromQuery] string eventId, IFormFile file, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(eventId))
                return BadRequest("eventId is required.");

            if (file == null || file.Length == 0)
                return BadRequest("A file is required.");

            var userId = EventManagementAuth.GetUserId(User);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            if (!EventManagementAuth.IsAdmin(User) && !await HasApprovedOrganizerAccessAsync(userId))
                return Forbid();

            var @event = await _eventService.GetEventByIdAsync(eventId);
            if (@event == null)
                return NotFound();

            if (!EventManagementAuth.CanMutateEvent(User, @event.OrganizerId))
                return Forbid();

            try
            {
                await using var stream = file.OpenReadStream();
                var attachment = await _attachmentService.UploadForEventAsync(eventId, stream, file.FileName, cancellationToken);
                return Ok(EventDtoMapper.ToAttachmentResponseDto(attachment));
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("event/{eventId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByEvent(string eventId)
        {
            var items = await _attachmentService.GetByEventAsync(eventId);
            return Ok(EventDtoMapper.ToAttachmentResponseDtos(items));
        }

        [HttpGet("download/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Download(string id)
        {
            var attachment = await _attachmentService.GetByIdAsync(id);
            if (attachment == null)
                return NotFound();

            var filePath = attachment.FilePath;
            if (string.IsNullOrEmpty(filePath))
                return BadRequest("File path not found");

            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), filePath);
            
            if (!System.IO.File.Exists(fullPath))
                return NotFound("File not found on disk");

            try
            {
                var fileBytes = await System.IO.File.ReadAllBytesAsync(fullPath);
                var fileName = Path.GetFileName(filePath);
                var contentType = GetContentType(fileName);
                return File(fileBytes, contentType, fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error downloading file: {ex.Message}");
            }
        }

        private static string GetContentType(string fileName)
        {
            var ext = Path.GetExtension(fileName).ToLowerInvariant();
            return ext switch
            {
                ".pdf" => "application/pdf",
                ".doc" => "application/msword",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".xls" => "application/vnd.ms-excel",
                ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ".png" => "image/png",
                ".jpg" or ".jpeg" => "image/jpeg",
                ".gif" => "image/gif",
                ".txt" => "text/plain",
                ".zip" => "application/zip",
                _ => "application/octet-stream"
            };
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = $"{nameof(UserRole.Admin)},{nameof(UserRole.EventOrganizer)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var userId = EventManagementAuth.GetUserId(User);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            if (!EventManagementAuth.IsAdmin(User) && !await HasApprovedOrganizerAccessAsync(userId))
                return Forbid();

            var attachment = await _attachmentService.GetByIdAsync(id);
            if (attachment == null)
                return NotFound();

            var @event = await _eventService.GetEventByIdAsync(attachment.EventId);
            if (@event == null)
                return NotFound();

            if (!EventManagementAuth.CanMutateEvent(User, @event.OrganizerId))
                return Forbid();

            try
            {
                await _attachmentService.DeleteAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
