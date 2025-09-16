import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Calendar, User, Package, DollarSign, CreditCard, MessageSquare, Check, X } from "lucide-react";
import { toast } from "sonner";

const Proposals = () => {
  const handleApprove = (proposalId: string) => {
    toast.success(`อนุมัติข้อเสนอ ${proposalId} เรียบร้อยแล้ว!`);
  };

  const handleReject = (proposalId: string) => {
    toast.error(`ปฏิเสธข้อเสนอ ${proposalId} แล้ว`);
  };

  // Mock data for proposals
  const proposals = [
    {
      id: 'P001',
      brokerName: 'นายสมชาย ใจดี',
      brokerPhone: '081-234-5678',
      brokerEmail: 'somchai@email.com',
      submitDate: '2024-01-15',
      contactDeadline: '2024-01-20',
      quantity: 500,
      proposedPrice: 120,
      paymentMethod: 'โอนเงิน',
      notes: 'ต้องการทุเรียนเกรด A เท่านั้น สำหรับส่งออก',
      status: 'pending'
    },
    {
      id: 'P002',
      brokerName: 'นางสาวมาลี รักสวน',
      brokerPhone: '089-876-5432',
      brokerEmail: 'malee@email.com',
      submitDate: '2024-01-14',
      contactDeadline: '2024-01-18',
      quantity: 300,
      proposedPrice: 100,
      paymentMethod: 'เงินสด',
      notes: 'รับทุกเกรด สามารถมารับที่สวนได้',
      status: 'pending'
    },
    {
      id: 'P003',
      brokerName: 'นายวิชัย ทุเรียน',
      brokerPhone: '092-345-6789',
      brokerEmail: 'wichai@email.com',
      submitDate: '2024-01-12',
      contactDeadline: '2024-01-16',
      quantity: 200,
      proposedPrice: 110,
      paymentMethod: 'ผ่อนชำระ',
      notes: 'จ่าย 50% ล่วงหน้า ส่วนที่เหลือจ่ายเมื่อรับของ',
      status: 'approved'
    }
  ];

  const pendingProposals = proposals.filter(p => p.status === 'pending');
  const approvedProposals = proposals.filter(p => p.status === 'approved');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/owner-dashboard">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">ข้อเสนอซื้อทุเรียน</h1>
                <p className="text-muted-foreground">พิจารณาข้อเสนอจากผู้รับเหมา</p>
              </div>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-soft">
              <FileText className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="shadow-card border-0 bg-card/80 backdrop-blur">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{proposals.length}</div>
                <div className="text-sm text-muted-foreground">ข้อเสนอทั้งหมด</div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-0 bg-gradient-to-br from-yellow-50 to-yellow-100 backdrop-blur">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-700">{pendingProposals.length}</div>
                <div className="text-sm text-yellow-600">รอพิจารณา</div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-0 bg-gradient-to-br from-green-50 to-green-100 backdrop-blur">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-700">{approvedProposals.length}</div>
                <div className="text-sm text-green-600">อนุมัติแล้ว</div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Proposals */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-yellow-500" />
              ข้อเสนอรอพิจารณา ({pendingProposals.length})
            </h2>
            
            {pendingProposals.length > 0 ? (
              <div className="space-y-4">
                {pendingProposals.map((proposal) => (
                  <Card key={proposal.id} className="shadow-card border-0 bg-card/80 backdrop-blur">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          ข้อเสนอ {proposal.id}
                        </CardTitle>
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          รอพิจารณา
                        </Badge>
                      </div>
                      <CardDescription>
                        ยื่นเมื่อ {proposal.submitDate} | ต้องการตอบกลับภายใน {proposal.contactDeadline}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Broker Info */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-foreground flex items-center gap-2">
                            <User className="h-4 w-4" />
                            ข้อมูลผู้รับเหมา
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div><strong>ชื่อ:</strong> {proposal.brokerName}</div>
                            <div><strong>โทรศัพท์:</strong> {proposal.brokerPhone}</div>
                            <div><strong>อีเมล:</strong> {proposal.brokerEmail}</div>
                          </div>
                        </div>

                        {/* Proposal Details */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-foreground flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            รายละเอียดข้อเสนอ
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Package className="h-3 w-3" />
                              <strong>ปริมาณ:</strong> {proposal.quantity} กิโลกรัม
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-3 w-3" />
                              <strong>ราคา:</strong> {proposal.proposedPrice} บาท/กก.
                            </div>
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-3 w-3" />
                              <strong>การจ่ายเงิน:</strong> {proposal.paymentMethod}
                            </div>
                          </div>
                        </div>
                      </div>

                      {proposal.notes && (
                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div>
                              <div className="font-medium text-sm text-foreground">หมายเหตุ:</div>
                              <div className="text-sm text-muted-foreground mt-1">{proposal.notes}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3 mt-6">
                        <Button
                          onClick={() => handleApprove(proposal.id)}
                          className="bg-gradient-success hover:opacity-90 text-white flex-1"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          อนุมัติข้อเสนอ
                        </Button>
                        <Button
                          onClick={() => handleReject(proposal.id)}
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50 flex-1"
                        >
                          <X className="h-4 w-4 mr-2" />
                          ปฏิเสธ
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="shadow-card border-0 bg-card/80 backdrop-blur">
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">ไม่มีข้อเสนอรอพิจารณา</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Approved Proposals */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              ข้อเสนอที่อนุมัติแล้ว ({approvedProposals.length})
            </h2>
            
            {approvedProposals.length > 0 ? (
              <div className="space-y-4">
                {approvedProposals.map((proposal) => (
                  <Card key={proposal.id} className="shadow-card border-0 bg-card/80 backdrop-blur">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          ข้อเสนอ {proposal.id}
                        </CardTitle>
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          อนุมัติแล้ว
                        </Badge>
                      </div>
                      <CardDescription>
                        ผู้รับเหมา: {proposal.brokerName} | ปริมาณ: {proposal.quantity} กก. | ราคา: {proposal.proposedPrice} บาท/กก.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="shadow-card border-0 bg-card/80 backdrop-blur">
                <CardContent className="p-8 text-center">
                  <Check className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">ยังไม่มีข้อเสนอที่อนุมัติ</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proposals;