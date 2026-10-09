# Recover explicit OpenAI mutations

Journal the presentation ID, pre-write revision, exact tool and arguments,
semantic intent, idempotency key and expected result before each mutation.
After success, retain the returned revision and transaction ID where supplied.
Re-read when planning from potentially changed state.

- Success with a revision means committed.
- Validation rejection means that individual request did not commit; fix it.
- Revision conflict requires re-reading and preserving intervening work, then
  reconciling the intended change and issuing a new request with a new key.
- Quota rejection requires replanning, never deleting work or bypassing a limit.
- Missing scope requires explaining the needed access, never another route.
- Timeout, 429, 5xx, disconnect or malformed output means uncertain result.

For an uncertain result, re-read and compare state and revision with the journal.
If the intended state is present and the revision advanced appropriately, the
write committed. If revision did not advance and the state is absent, retry the
identical request with its original key. If other edits intervened or state is
ambiguous, reconcile from fresh state; do not guess. Never automatically repeat
an externally visible or destructive operation.

Individual OpenAI tools commit separately. An interrupted sequence may have
completed earlier mutations: do not claim that all operations rolled back.
Resume from the first missing intended change, preserving completed IDs and
states rather than rebuilding lookalikes. Use `undo_transaction` only for a known
confirmed mistaken transaction with authorization to reverse it. Stop when reads
cannot establish authoritative state.
