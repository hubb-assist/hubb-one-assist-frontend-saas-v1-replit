import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  FileText, 
  MapPin, 
  Calendar, 
  Tag
} from 'lucide-react';
import { SubscriberDetail } from './types';

interface SubscriberDetailProps {
  subscriber: SubscriberDetail;
}

export default function SubscriberDetailView({ subscriber }: SubscriberDetailProps) {
  if (!subscriber) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Detalhes do Assinante</CardTitle>
              <CardDescription>Informações completas do assinante</CardDescription>
            </div>
            <Badge variant={subscriber.is_active ? "outline" : "destructive"} className={subscriber.is_active ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
              {subscriber.is_active ? "Ativo" : "Inativo"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informações básicas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Responsável</p>
                  <p className="font-medium">{subscriber.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nome da Clínica</p>
                  <p className="font-medium">{subscriber.clinic_name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{subscriber.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{subscriber.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Documento</p>
                  <p className="font-medium">{subscriber.document}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Segmento</p>
                  <p className="font-medium">{subscriber.segment_name || 'Não definido'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Endereço</h3>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">
                  {subscriber.address}, {subscriber.number} - {subscriber.city}/{subscriber.state} - CEP: {subscriber.zip_code}
                </p>
              </div>
            </div>
          </div>

          {/* Usuário Administrador */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Usuário Administrador (DONO_ASSINANTE)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{subscriber.admin_user_name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{subscriber.admin_user_email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Datas */}
          <div className="pt-4 border-t flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Criado em: {format(new Date(subscriber.created_at), 'dd/MM/yyyy', { locale: ptBR })}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Atualizado em: {format(new Date(subscriber.updated_at), 'dd/MM/yyyy', { locale: ptBR })}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}