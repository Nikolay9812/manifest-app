import React from 'react'
import { Document, Page, Text } from '@react-pdf/renderer';

export default function CalendarPDF({ currentDate, manifests, totalHours, totalKm, totalDelivered, totalReturned, totalManifests, loading }) {

  return (
    <Document>
        <Page>
        <Text>{`Current Date: ${currentDate.toLocaleDateString()}`}</Text>
            {/* Render calendar data */}
            <Text>{`Total Hours: ${totalHours}`}</Text>
            <Text>{`Total Kilometers: ${totalKm}`}</Text>
            <Text>{`Total Delivered: ${totalDelivered}`}</Text>
            <Text>{`Total Returned: ${totalReturned}`}</Text>
            <Text>{`Total Manifests: ${totalManifests}`}</Text>
            {/* Render manifests */}
            {manifests.map(manifest => (
                <React.Fragment key={manifest._id}>
                    <Text>{`Manifest ID: ${manifest.createdAt}`}</Text>
                    <Text>{`Manifest ID: ${manifest.startTime}`}</Text>
                    <Text>{`Manifest ID: ${manifest.endTime}`}</Text>
                    <Text>{`Manifest ID: ${manifest.endTime}`}</Text>
                    <Text>{`Manifest ID: ${manifest.workingHours}`}</Text>
                    {/* Add more details as needed */}
                </React.Fragment>
            ))}
        </Page>
    </Document>
  )
}
