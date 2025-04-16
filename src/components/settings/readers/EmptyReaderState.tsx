
export default function EmptyReaderState({ type = 'readers' }: { type?: 'readers' | 'antennas' }) {
  return (
    <div className="text-center py-8 border rounded-md">
      {type === 'readers' ? (
        <>
          <p className="text-muted-foreground mb-4">No RFID readers detected</p>
          <p className="text-sm text-muted-foreground">
            Readers will appear here once they send heartbeat messages to the MQTT broker
          </p>
        </>
      ) : (
        <>
          <p className="text-muted-foreground mb-4">No RFID readers with antennas detected</p>
          <p className="text-sm text-muted-foreground">
            Assign readers to departments and make sure they have active antennas
          </p>
        </>
      )}
    </div>
  );
}
