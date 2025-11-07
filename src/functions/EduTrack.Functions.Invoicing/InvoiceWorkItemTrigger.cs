using System;
using System.Threading.Tasks;
using Azure.Messaging.ServiceBus;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace EduTrack.Functions.Invoicing;

public class InvoiceWorkItemTrigger
{
    private readonly ILogger<InvoiceWorkItemTrigger> _logger;

    public InvoiceWorkItemTrigger(ILogger<InvoiceWorkItemTrigger> logger)
    {
        _logger = logger;
    }

    [Function(nameof(InvoiceWorkItemTrigger))]
    public async Task Run(
        [ServiceBusTrigger("invoice-work-items", Connection = "ServiceBusConnection")]
        ServiceBusReceivedMessage message,
        ServiceBusMessageActions messageActions)
    {
        _logger.LogInformation("Message ID: {id}", message.MessageId);
        _logger.LogInformation("Message Body: {body}", message.Body);
        _logger.LogInformation("Message Content-Type: {contentType}", message.ContentType);

        // Complete the message
        await messageActions.CompleteMessageAsync(message);
    }
}
