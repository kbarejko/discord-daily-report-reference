import { MemoryReportRepository } from './memory-repository'
import { describeReportRepository } from './repository.suite'

describeReportRepository('MemoryReportRepository', async () => new MemoryReportRepository())
