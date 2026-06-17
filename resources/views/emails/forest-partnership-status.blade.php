@component('mail::message')
# Forest Partnership Request {{ ucfirst($request->status) }}

Hello {{ $request->contact_person }},

Your forest partnership request for {{ $request->business_name }} has been {{ $request->status }}.

@if($request->status === 'accepted')
We are happy to move forward with your proposal and will contact you soon.
@else
We are unable to proceed with your request at this time. Please contact us if you would like to discuss other options.
@endif

Thank you,
Rural Rising
@endcomponent
